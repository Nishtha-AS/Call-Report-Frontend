import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { IonContent, IonPage, useIonRouter } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './call-report-step8.css';

type MediaItem = {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'other';
  url: string; // object URL for preview
  size: number;
};

const ACCEPT = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_MB = 20;

function toKind(mime: string): MediaItem['type'] {
  if (mime === 'application/pdf') return 'pdf';
  if (mime.startsWith('image/')) return 'image';
  return 'other';
}

// ✅ No-empty-safe revoker
const safeRevoke = (u: string) => {
  try {
    URL.revokeObjectURL(u);
  } catch (err) {
    // Keep a statement in catch so eslint no-empty is satisfied
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('revokeObjectURL failed:', err);
    }
  }
};

export default function CallReportStep8() {
  const router = useIonRouter();
  const { ctpt } = useParams<{ ctpt: string }>();
  const isManufacturing = true;

  // Generate a Call Report id to pass to the success route
  const crId = useMemo(
    () => `CR-${ctpt}-${Date.now().toString().slice(-6)}`,
    [ctpt]
  );

  // Hidden inputs (browse / capture) per section
  const inFactoryBrowse = useRef<HTMLInputElement | null>(null);
  const inFactoryCapture = useRef<HTMLInputElement | null>(null);
  const inOfficeBrowse = useRef<HTMLInputElement | null>(null);
  const inOfficeCapture = useRef<HTMLInputElement | null>(null);
  const inCollBrowse = useRef<HTMLInputElement | null>(null);
  const inCollCapture = useRef<HTMLInputElement | null>(null);
  const inOtherBrowse = useRef<HTMLInputElement | null>(null);

  // Object URL tracking (for safe cleanup)
  const allObjectUrlsRef = useRef<Set<string>>(new Set());

  // Section states
  const [factory, setFactory] = useState<MediaItem[]>([]);
  const [office, setOffice] = useState<MediaItem[]>([]);
  const [collateral, setCollateral] = useState<MediaItem[]>([]);
  const [otherFiles, setOtherFiles] = useState<MediaItem[]>([]);

  // Multi-select sets
  const [factorySel, setFactorySel] = useState<Set<string>>(new Set());
  const [officeSel, setOfficeSel] = useState<Set<string>>(new Set());
  const [collSel, setCollSel] = useState<Set<string>>(new Set());

  // Inline errors
  const [errFactory, setErrFactory] = useState('');
  const [errOffice, setErrOffice] = useState('');
  const [errColl, setErrColl] = useState('');
  const [errOther, setErrOther] = useState('');

  // Preview modal
  const [preview, setPreview] = useState<MediaItem | null>(null);

  const acceptAttr = useMemo(() => ACCEPT.join(','), []);

  // Helpers
  const addFiles = (
    files: FileList | null,
    sink: React.Dispatch<React.SetStateAction<MediaItem[]>>,
    setErr: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setErr('');
    if (!files) return;

    const tooBig: string[] = [];
    const badType: string[] = [];
    const items: MediaItem[] = [];

    Array.from(files).forEach((f) => {
      if (!ACCEPT.includes(f.type)) {
        badType.push(f.name);
        return;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        tooBig.push(f.name);
        return;
      }
      const url = URL.createObjectURL(f);
      allObjectUrlsRef.current.add(url);
      items.push({
        id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        type: toKind(f.type),
        url,
        size: f.size,
      });
    });

    if (badType.length || tooBig.length) {
      const msgs: string[] = [];
      if (badType.length) msgs.push(`Unsupported type: ${badType.join(', ')}`);
      if (tooBig.length) msgs.push(`Exceeds ${MAX_MB}MB: ${tooBig.join(', ')}`);
      setErr(msgs.join(' | '));
    }
    if (!items.length) return;
    sink(prev => [...prev, ...items]);
  };

  const removeById = (
    id: string,
    setArr: React.Dispatch<React.SetStateAction<MediaItem[]>>,
    setSel?: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    setArr(prev => {
      const found = prev.find(x => x.id === id);
      if (found) {
        safeRevoke(found.url);
        allObjectUrlsRef.current.delete(found.url);
      }
      return prev.filter(x => x.id !== id);
    });
    if (setSel) {
      setSel(prev => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  };

  const removeSelected = (
    selected: Set<string>,
    setArr: React.Dispatch<React.SetStateAction<MediaItem[]>>,
    setSel: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    if (!selected.size) return;
    setArr(prev => {
      const keep: MediaItem[] = [];
      prev.forEach((m) => {
        if (selected.has(m.id)) {
          safeRevoke(m.url);
          allObjectUrlsRef.current.delete(m.url);
        } else {
          keep.push(m);
        }
      });
      return keep;
    });
    setSel(new Set());
  };

  const toggleSelect = (id: string, setSel: React.Dispatch<React.SetStateAction<Set<string>>>) => {
    setSel(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  // Cleanup all object URLs on unmount
  useEffect(() => {
    return () => {
      allObjectUrlsRef.current.forEach((u) => {
        safeRevoke(u);
      });
      allObjectUrlsRef.current.clear();
    };
  }, []);

  // Actions
  const onSave = () => {
    console.log('Step8 Save', {
      ctpt,
      factory: factory.map(f => ({ name: f.name, type: f.type, size: f.size })),
      office: office.map(f => ({ name: f.name, type: f.type, size: f.size })),
      collateral: collateral.map(f => ({ name: f.name, type: f.type, size: f.size })),
      other: otherFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
    });
    alert('Saved.');
  };

  const onSubmit = () => {
    if (isManufacturing && factory.length === 0) {
      setErrFactory('At least one factory photo is required for a manufacturing unit.');
      document.getElementById('factory-sec')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // Navigate to success screen using direct window location
    setTimeout(() => {
      window.location.href = `/call-report/success/${encodeURIComponent(crId)}`;
    }, 100);
  };

  const goBack = () => {
    // Navigate back to the previous step using direct window location
    setTimeout(() => {
      window.location.href = `/call-report/step-7/${encodeURIComponent(ctpt)}`;
    }, 100);
  };

  return (
    <IonPage>
      <AppHeader
        title="Call Report"
        // Updated to use direct window navigation
        onBack={() => {
          setTimeout(() => {
            window.location.href = `/call-report/step-7/${encodeURIComponent(ctpt)}`;
          }, 100);
        }}
      />

      <IonContent className="cr8-content">
        <div className="page-shell">
          {/* Header */}
          <div className="topbar bounded">
            <h2 className="cr8-h">Photographs</h2>
            <div className="topbar-rt">
              <span className="page-count">Page <strong>8</strong> of <strong>8</strong></span>
              <span className="ctpt-badge">CTPT- <strong>{ctpt}</strong></span>
            </div>
          </div>
          <div className="cr8-subnote bounded">All <span className="req">*</span> fields are mandatory</div>

          {/* ===== Factory ===== */}
          <section id="factory-sec" className="bounded">
            <div className="sec-row">
              <div className="sec-h">Factory (Mandatory for manufacturing unit):</div>
              {factorySel.size > 0 && (
                <button className="link danger" onClick={() => removeSelected(factorySel, setFactory, setFactorySel)}>
                  🗑 Delete Selected ({factorySel.size})
                </button>
              )}
            </div>

            <div className={`dropbox ${errFactory ? 'has-error' : ''}`}>
              <div className="btns">
                <button className="btn ghost" onClick={() => inFactoryBrowse.current?.click()}>📁 Browse</button>
                <button className="btn ghost" onClick={() => inFactoryCapture.current?.click()}>📷 Capture</button>
              </div>
              <div className="hint">
                <div>upload .jpg, .png, .pdf, etc</div>
                <div className="muted">Max file size {MAX_MB} Mb</div>
              </div>
              {errFactory && <div className="error">{errFactory}</div>}
              <input
                ref={inFactoryBrowse}
                type="file"
                accept={acceptAttr}
                multiple
                onChange={(e) => addFiles(e.target.files, setFactory, setErrFactory)}
                hidden
              />
              <input
                ref={inFactoryCapture}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(e) => addFiles(e.target.files, setFactory, setErrFactory)}
                hidden
              />
            </div>

            {factory.length > 0 && (
              <div className="gallery">
                {factory.map(m => (
                  <MediaTile
                    key={m.id}
                    item={m}
                    isSelected={factorySel.has(m.id)}
                    onCheck={() => toggleSelect(m.id, setFactorySel)}
                    onRemove={() => removeById(m.id, setFactory, setFactorySel)}
                    onPreview={() => {
                      if (m.type === 'pdf') window.open(m.url, '_blank', 'noopener,noreferrer');
                      else setPreview(m);
                    }}
                  />
                ))}
                <AddMore onBrowse={() => inFactoryBrowse.current?.click()} onCapture={() => inFactoryCapture.current?.click()} />
              </div>
            )}
          </section>

          {/* ===== Office ===== */}
          <section className="bounded">
            <div className="sec-row">
              <div className="sec-h">Office:</div>
              {officeSel.size > 0 && (
                <button className="link danger" onClick={() => removeSelected(officeSel, setOffice, setOfficeSel)}>
                  🗑 Delete Selected ({officeSel.size})
                </button>
              )}
            </div>

            <div className={`dropbox ${errOffice ? 'has-error' : ''}`}>
              <div className="btns">
                <button className="btn ghost" onClick={() => inOfficeBrowse.current?.click()}>📁 Browse</button>
                <button className="btn ghost" onClick={() => inOfficeCapture.current?.click()}>📷 Capture</button>
              </div>
              <div className="hint">
                <div>upload .jpg, .png, .pdf, etc</div>
                <div className="muted">Max file size {MAX_MB} Mb</div>
              </div>
              {errOffice && <div className="error">{errOffice}</div>}
              <input
                ref={inOfficeBrowse}
                type="file"
                accept={acceptAttr}
                multiple
                onChange={(e) => addFiles(e.target.files, setOffice, setErrOffice)}
                hidden
              />
              <input
                ref={inOfficeCapture}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(e) => addFiles(e.target.files, setOffice, setErrOffice)}
                hidden
              />
            </div>

            {office.length > 0 && (
              <div className="gallery">
                {office.map(m => (
                  <MediaTile
                    key={m.id}
                    item={m}
                    isSelected={officeSel.has(m.id)}
                    onCheck={() => toggleSelect(m.id, setOfficeSel)}
                    onRemove={() => removeById(m.id, setOffice, setOfficeSel)}
                    onPreview={() => {
                      if (m.type === 'pdf') window.open(m.url, '_blank', 'noopener,noreferrer');
                      else setPreview(m);
                    }}
                  />
                ))}
                <AddMore onBrowse={() => inOfficeBrowse.current?.click()} onCapture={() => inOfficeCapture.current?.click()} />
              </div>
            )}
          </section>

          {/* ===== Collateral ===== */}
          <section className="bounded">
            <div className="sec-row">
              <div className="sec-h">Collateral:</div>
              {collSel.size > 0 && (
                <button className="link danger" onClick={() => removeSelected(collSel, setCollateral, setCollSel)}>
                  🗑 Delete Selected ({collSel.size})
                </button>
              )}
            </div>

            <div className={`dropbox ${errColl ? 'has-error' : ''}`}>
              <div className="btns">
                <button className="btn ghost" onClick={() => inCollBrowse.current?.click()}>📁 Browse</button>
                <button className="btn ghost" onClick={() => inCollCapture.current?.click()}>📷 Capture</button>
              </div>
              <div className="hint">
                <div>upload .jpg, .png, .pdf, etc</div>
                <div className="muted">Max file size {MAX_MB} Mb</div>
              </div>
              {errColl && <div className="error">{errColl}</div>}
              <input
                ref={inCollBrowse}
                type="file"
                accept={acceptAttr}
                multiple
                onChange={(e) => addFiles(e.target.files, setCollateral, setErrColl)}
                hidden
              />
              <input
                ref={inCollCapture}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={(e) => addFiles(e.target.files, setCollateral, setErrColl)}
                hidden
              />
            </div>

            {collateral.length > 0 && (
              <div className="gallery">
                {collateral.map(m => (
                  <MediaTile
                    key={m.id}
                    item={m}
                    isSelected={collSel.has(m.id)}
                    onCheck={() => toggleSelect(m.id, setCollSel)}
                    onRemove={() => removeById(m.id, setCollateral, setCollSel)}
                    onPreview={() => {
                      if (m.type === 'pdf') window.open(m.url, '_blank', 'noopener,noreferrer');
                      else setPreview(m);
                    }}
                  />
                ))}
                <AddMore onBrowse={() => inCollBrowse.current?.click()} onCapture={() => inCollCapture.current?.click()} />
              </div>
            )}
          </section>

          {/* ===== Other attachments ===== */}
          <section className="bounded">
            <div className="sec-row">
              <div className="sec-h">Other Attachments (if Any):</div>
            <button className="link" onClick={() => inOtherBrowse.current?.click()}>➕ Add Attachments</button>
            </div>

            {errOther && <div className="error mb8">{errOther}</div>}

            {otherFiles.length > 0 && (
              <div className="gallery">
                {otherFiles.map(m => (
                  <MediaTile
                    key={m.id}
                    item={m}
                    onRemove={() => removeById(m.id, setOtherFiles)}
                    onPreview={() => {
                      if (m.type === 'pdf') window.open(m.url, '_blank', 'noopener,noreferrer');
                      else setPreview(m);
                    }}
                  />
                ))}
              </div>
            )}

            <input
              ref={inOtherBrowse}
              type="file"
              accept={acceptAttr}
              multiple
              onChange={(e) => addFiles(e.target.files, setOtherFiles, setErrOther)}
              hidden
            />
          </section>

          {/* ===== Sticky actions ===== */}
          <div className="cr8-sticky-actions">
            <div className="bounded cr8-actions-inner">
              <button className="btn ghost big" onClick={goBack}>Back</button>
              <div className="spacer" />
              <button className="btn grad big" onClick={onSave}>Save</button>
              <button className="btn grad big" onClick={onSubmit}>Submit</button>
            </div>
          </div>

          <div className="after-actions-spacer" />
        </div>
      </IonContent>

      {/* Image preview lightbox */}
      {preview && preview.type === 'image' && (
        <div className="lightbox" onClick={() => setPreview(null)}>
          <img className="lightbox-img" src={preview.url} alt={preview.name} />
          <button
            className="lightbox-close"
            onClick={(e) => { e.stopPropagation(); setPreview(null); }}
            aria-label="Close preview"
          >
            ×
          </button>
        </div>
      )}

    </IonPage>
  );
}

/* --- Presentational items --- */

function MediaTile(props: {
  item: MediaItem;
  isSelected?: boolean;
  onCheck?: () => void;
  onRemove?: () => void;
  onPreview?: () => void;
}) {
  const { item, isSelected, onCheck, onRemove, onPreview } = props;
  return (
    <div className={`tile ${isSelected ? 'selected' : ''}`}>
      <button className="tile-click" onClick={onPreview} aria-label={`Preview ${item.name}`} />
      {onCheck && (
        <button
          className={`tile-check ${isSelected ? 'on' : ''}`}
          onClick={(e) => { e.stopPropagation(); onCheck(); }}
          aria-label={isSelected ? 'Unselect' : 'Select'}
        />
      )}
      {item.type === 'image' ? (
        <img src={item.url} alt={item.name} />
      ) : item.type === 'pdf' ? (
        <div className="pdf-chip">PDF</div>
      ) : (
        <div className="pdf-chip">FILE</div>
      )}
      {onRemove && (
        <button className="tile-x" onClick={(e) => { e.stopPropagation(); onRemove(); }} aria-label="Remove file">×</button>
      )}
    </div>
  );
}

function AddMore({ onBrowse, onCapture }: { onBrowse: () => void; onCapture: () => void }) {
  return (
    <div className="tile addmore">
      <div className="am-btns">
        <button className="btn ghost small" onClick={onBrowse}>📁 Browse</button>
        <button className="btn ghost small" onClick={onCapture}>📷 Capture</button>
      </div>
      <div className="am-text">ADD<br/>MORE</div>
    </div>
  );
}

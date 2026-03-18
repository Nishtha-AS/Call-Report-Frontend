import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { IonContent } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './call-report-step1.css';

type AusfbRow = { id: string; subType: string; sanctioned: number; disbursed: number };
type OtherRow = { bank: string; subType: string; sanctioned: number; disbursed: number };

type NewOtherForm = {
  bank: string;
  subType: string;
  sanctioned: string;
  disbursed: string;
};

const INR = (n: number) => n.toLocaleString('en-IN');

/* Tables (sample numbers retained) */
const AUSFB_DATA: AusfbRow[] = [
  { id: 'FAC-18891', subType: 'Cash Credit', sanctioned: 123456.67, disbursed: 123456.78 },
  { id: 'FAC-18892', subType: 'Overdraft',   sanctioned: 123456.67, disbursed: 123456.78 },
];

const OTHER_INIT: OtherRow[] = [
  { bank: 'Yes Bank', subType: 'Cash Credit', sanctioned: 123456.67, disbursed: 123456.78 },
];

/** Real Pune addresses (no placeholders) */
const ADDRESS_OPTIONS = [
  '201, Senapati Bapat Rd, Shivajinagar, Pune, Maharashtra 411016',
  '2nd Floor, Fergusson College Rd, Deccan Gymkhana, Pune, Maharashtra 411004',
  'Plot 18, MIDC Bhosari, Pimpri-Chinchwad, Pune, Maharashtra 411026',
  'Magarpatta City, Hadapsar, Pune, Maharashtra 411028',
];

const BANKS = ['Yes Bank', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'State Bank of India'] as const;
const FACILITY_SUBTYPES = ['Cash Credit', 'Overdraft', 'Term Loan', 'Working Capital', 'Bank Guarantee'] as const;

/** CTPT → meta for deep links & state hand-off */
const CUSTOMER_INDEX: Record<string, { name: string; branch: string; customerId: string; dateAdded: string }> = {
  'CTPT-2346': { name: 'Shyam Enterprises', branch: 'Pune', customerId: 'CUST-2346', dateAdded: '11 Feb 2025' },
};

export default function CallReportStep1() {
  const history = useHistory();
  const { ctpt } = useParams<{ ctpt: string }>();
  const key = (ctpt || '').toUpperCase();
  const meta = CUSTOMER_INDEX[key] || {
    name: 'Shyam Enterprises',
    branch: 'Pune',
    customerId: 'CUST-2346',
    dateAdded: '11 Feb 2025',
  };

  // header (readonly)
  const [borrowerName] = useState(meta.name);
  const [customerId]   = useState(meta.customerId);

  // other-bank exposure table
  const [otherRows, setOtherRows] = useState<OtherRow[]>(OTHER_INIT);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newOther, setNewOther] = useState<NewOtherForm>({ bank: '', subType: '', sanctioned: '', disbursed: '' });
  const [newErrors, setNewErrors] = useState<Record<string, string>>({});

  // borrower address dropdown
  const [addrQuery, setAddrQuery] = useState('');
  const [addr, setAddr] = useState<string>('');
  const [addrOpen, setAddrOpen] = useState(false);
  const addrBoxRef = useRef<HTMLDivElement | null>(null);

  // visit location
  const [visitAddress, setVisitAddress] = useState<string>(ADDRESS_OPTIONS[0]);
  const [locBusy, setLocBusy] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoError, setGeoError] = useState<string>('');

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!addrBoxRef.current) return;
      if (!addrBoxRef.current.contains(e.target as Node)) setAddrOpen(false);
    };
    if (addrOpen) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [addrOpen]);

  const filteredAddresses = useMemo(() => {
    const q = addrQuery.trim().toLowerCase();
    if (!q) return ADDRESS_OPTIONS;
    return ADDRESS_OPTIONS.filter(a => a.toLowerCase().includes(q));
  }, [addrQuery]);

  const autoDetect = async () => {
    setLocBusy(true);
    setGeoError('');
    try {
      if (!navigator.geolocation) {
        setGeoError('Geolocation is not supported in this browser.');
        return;
      }
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 15000 })
      );
      const { latitude, longitude } = pos.coords;
      setCoords({ lat: latitude, lon: longitude });

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        { headers: { Accept: 'application/json' } }
      );
      const j = await res.json();
      const label = j?.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
      setVisitAddress(label);
    } catch (e: any) {
      setGeoError(e?.message || 'Location detection failed.');
    } finally {
      setLocBusy(false);
    }
  };

  const mapUrl = useMemo(() => {
    if (coords) {
      const q = `${coords.lat},${coords.lon}`;
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(visitAddress)}&z=15&output=embed`;
  }, [coords, visitAddress]);

  const removeOther = (idx: number) => setOtherRows(rows => rows.filter((_, i) => i !== idx));
  const openNew = () => { setNewOther({ bank: '', subType: '', sanctioned: '', disbursed: '' }); setNewErrors({}); setShowNewModal(true); };

  const addOther = () => {
    const errs: Record<string, string> = {};
    if (!newOther.bank.trim()) errs.bank = 'Required';
    if (!newOther.subType.trim()) errs.subType = 'Required';
    const sanc = Number(newOther.sanctioned);
    const disb = Number(newOther.disbursed);
    if (!newOther.sanctioned || isNaN(sanc) || sanc < 0) errs.sanctioned = 'Enter a valid amount';
    if (!newOther.disbursed || isNaN(disb) || disb < 0) errs.disbursed = 'Enter a valid amount';

    setNewErrors(errs);
    if (Object.keys(errs).length) return;

    setOtherRows(rows => [...rows, {
      bank: newOther.bank.trim(),
      subType: newOther.subType.trim(),
      sanctioned: sanc,
      disbursed: disb
    }]);
    setShowNewModal(false);
  };

  const formValid = !!addr;

  const onSave = () => {
    console.log('Saving Step 1', {
      ctpt, borrowerName, customerId, ausfb: AUSFB_DATA, other: otherRows,
      borrowerAddress: addr, visitAddress, coords, branch: meta.branch, dateAdded: meta.dateAdded
    });
    // alert('Saved.');
  };

  const goNext = () => formValid && history.push(`/call-report/step-2/${encodeURIComponent(ctpt)}`);

  return (
    <>
      <AppHeader title="Call Report" onBack={() => history.goBack()} />

      <IonContent className="cr1-content">
        <div className="page-shell">
          <div className="ctpt-row bounded">
            <span className="ctpt-badge">CTPT- <strong>{(ctpt || '').toUpperCase()}</strong></span>
            <span className="branch-chip">{meta.branch}</span>
          </div>

          <div className="cr1-top bounded">
            <h2 className="cr1-h">General Details <span className="muted">(a)</span></h2>
            <div className="page-count">Page <strong>1</strong> of <strong>7</strong></div>
          </div>
          <div className="cr1-subnote bounded">All <span className="req">*</span> fields are mandatory</div>

          <div className="grid-2 bounded">
            <div className="field">
              <label>Name of Borrower:</label>
              <input className="pill readonly" readOnly value={borrowerName} />
            </div>
            <div className="field">
              <label>Customer ID:</label>
              <input className="pill readonly" readOnly value={customerId} />
            </div>
          </div>

          <section className="card bounded">
            <div className="card-h">Exposure in INR Lakh <span className="muted">(AUSFB)</span></div>
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th className="w-id">ID</th>
                    <th>Facility Sub Type</th>
                    <th className="num">Sanctioned (INR)</th>
                    <th className="num">Disbursed (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {AUSFB_DATA.map(r => (
                    <tr key={r.id}>
                      <td className="w-id">{r.id}</td>
                      <td>{r.subType}</td>
                      <td className="num">{INR(r.sanctioned)}</td>
                      <td className="num">{INR(r.disbursed)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card bounded">
            <div className="card-h">Exposure in INR Lakh <span className="muted">(Other Bank)</span></div>
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Bank</th>
                    <th>Facility Sub Type</th>
                    <th className="num">Sanctioned (INR)</th>
                    <th className="num">Disbursed (INR)</th>
                    <th className="w-act"></th>
                  </tr>
                </thead>
                <tbody>
                  {otherRows.map((r, i) => (
                    <tr key={`${r.bank}-${i}`}>
                      <td>{r.bank}</td>
                      <td>{r.subType}</td>
                      <td className="num">{INR(r.sanctioned)}</td>
                      <td className="num">{INR(r.disbursed)}</td>
                      <td className="w-act">
                        <button className="icon danger" onClick={() => removeOther(i)} title="Delete row">🗑</button>
                      </td>
                    </tr>
                  ))}
                  {otherRows.length === 0 && (
                    <tr><td colSpan={5} className="empty">No other-bank exposure captured.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="row-add">
              <button className="btn ghost" onClick={openNew}>＋ Add New</button>
            </div>
          </section>

          <div className="field mt8 bounded">
            <label>Borrower Address:<span className="req">*</span></label>

            <div className={`dropdown ${addrOpen ? 'open' : ''}`} ref={addrBoxRef}>
              <input
                className={`pill ${!addr ? 'invalid' : ''}`}
                onFocus={() => setAddrOpen(true)}
                placeholder="-select-"
                value={addrOpen ? addrQuery : (addr || '')}
                onChange={(e) => setAddrQuery(e.target.value)}
                onClick={() => { setAddrQuery(''); setAddrOpen(true); }}
              />
              {addrOpen && (
                <div className="menu">
                  {filteredAddresses.map(it => (
                    <div
                      key={it}
                      className={`menu-item ${addr === it ? 'active' : ''}`}
                      onClick={() => { setAddr(it); setAddrQuery(it); setAddrOpen(false); }}
                    >
                      {it}
                    </div>
                  ))}
                  {filteredAddresses.length === 0 && (
                    <div className="menu-empty">No matches</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <section className="card bounded">
            <div className="card-h row">
              <span>Business Visit Location:</span>
              <button className="btn small" onClick={autoDetect} disabled={locBusy}>
                {locBusy ? 'Detecting…' : 'AUTO-DETECT'}
              </button>
            </div>

            <div className="addr-inline">
              <span className="loc-dot">📍</span>
              <input
                className="pill grow"
                value={visitAddress}
                onChange={(e) => setVisitAddress(e.target.value)}
              />
              <button className="link" onClick={() => setCoords(null)}>Edit</button>
            </div>
            {geoError && <div className="err">{geoError}</div>}

            <div className="map-frame">
              <iframe title="map" src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </section>
        </div>

        {/* This div acts as a spacer to prevent content from being hidden by the fixed action bar */}
        <div className="bottom-spacer" />
      </IonContent>

      {/* DOCKED action row — appears at the very bottom, above footer */}
      <div className="cr1-actions-bar">
        <div className="cr1-actions-inner bounded">
          <button className="btn ghost big" onClick={() => history.push('/my-customers')}>Back</button>
          <button className="btn big" onClick={onSave}>Save</button>
          <button className={`btn big ${!formValid ? 'disabled' : ''}`} disabled={!formValid} onClick={goNext}>Next</button>
        </div>
      </div>

      {/* Add New (Other Bank) Modal */}
      {showNewModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-h">
              <strong>Add Other-Bank Exposure</strong>
              <button className="icon" onClick={() => setShowNewModal(false)} aria-label="Close">✕</button>
            </div>
            <div className="modal-b">
              <div className="grid-2">
                <div className="field">
                  <label>Bank<span className="req">*</span></label>
                  <select
                    value={newOther.bank}
                    onChange={(e) => setNewOther(o => ({ ...o, bank: e.target.value }))}
                    className={newErrors.bank ? 'invalid' : ''}
                  >
                    <option value="">— Select Bank —</option>
                    {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {newErrors.bank && <div className="err">{newErrors.bank}</div>}
                </div>
                <div className="field">
                  <label>Facility Sub Type<span className="req">*</span></label>
                  <select
                    value={newOther.subType}
                    onChange={(e) => setNewOther(o => ({ ...o, subType: e.target.value }))}
                    className={newErrors.subType ? 'invalid' : ''}
                  >
                    <option value="">— Select Sub Type —</option>
                    {FACILITY_SUBTYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {newErrors.subType && <div className="err">{newErrors.subType}</div>}
                </div>
              </div>

              <div className="grid-2">
                <div className="field">
                  <label>Sanctioned (INR)<span className="req">*</span></label>
                  <input
                    value={newOther.sanctioned}
                    onChange={(e) => setNewOther(o => ({ ...o, sanctioned: e.target.value }))}
                    inputMode="decimal"
                    className={newErrors.sanctioned ? 'invalid' : ''}
                    placeholder="0.00"
                  />
                  {newErrors.sanctioned && <div className="err">{newErrors.sanctioned}</div>}
                </div>
                <div className="field">
                  <label>Disbursed (INR)<span className="req">*</span></label>
                  <input
                    value={newOther.disbursed}
                    onChange={(e) => setNewOther(o => ({ ...o, disbursed: e.target.value }))}
                    inputMode="decimal"
                    className={newErrors.disbursed ? 'invalid' : ''}
                    placeholder="0.00"
                  />
                  {newErrors.disbursed && <div className="err">{newErrors.disbursed}</div>}
                </div>
              </div>
            </div>
            <div className="modal-f">
              <button className="btn ghost" onClick={() => setShowNewModal(false)}>Cancel</button>
              <button className="btn" onClick={addOther}>Add</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
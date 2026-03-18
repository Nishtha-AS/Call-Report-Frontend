import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router';
import { IonContent } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import './call-report-step2.css';

type Official = {
  name: string;
  email?: string;
  empCode?: string;
  designation?: string;
};

type Rep = {
  name: string;
  designation: string;
};

const OFFICIAL_SUGGESTIONS: Official[] = [
  { name: 'Shyam Pawar', email: 'shyam.pawar@aadiswan.com', empCode: '11233', designation: 'Credit Manager' },
  { name: 'Rajat Sharma', email: 'rajat.sharma@aadiswan.com', empCode: '11214', designation: 'Relationship Manager' },
  { name: 'Meenakshi Sharma', email: 'meenakshi.sharma@aadiswan.com', empCode: '11228', designation: 'Relationship Manager' },
  { name: 'Vinay Kulkarni', email: 'vinay.kul@aadiswan.com', empCode: '11257', designation: 'Cluster Manager' },
];

const REP_NAME_OPTIONS = [
  'Ram Kumar (Partner)',
  'Shyam Singh (Partner)',
  'Mohan (Property Owner)',
  'Other: Enter Name',
];

const REP_DESG_OPTIONS = [
  'Partner',
  'Proprietor',
  'Director',
  'Owner',
  'Other: Enter Designation',
];

export default function CallReportStep2() {
  const history = useHistory();
  const { ctpt } = useParams<{ ctpt: string }>();

  // (a) Tag input – accompanying officials
  const [officialQuery, setOfficialQuery] = useState('');
  const [officialFocus, setOfficialFocus] = useState(false);
  const [officials, setOfficials] = useState<Official[]>([
    OFFICIAL_SUGGESTIONS[0],
    OFFICIAL_SUGGESTIONS[1],
    OFFICIAL_SUGGESTIONS[2],
  ]);
  const tagBoxRef = useRef<HTMLDivElement | null>(null);

  // (b) Company reps met
  const [repName, setRepName] = useState('');
  const [repNameOpen, setRepNameOpen] = useState(false);
  const [repDesg, setRepDesg] = useState('');
  const [repDesgOpen, setRepDesgOpen] = useState(false);
  const [reps, setReps] = useState<Rep[]>([
    { name: 'Ram Kumar (Partner)', designation: 'Partner' },
  ]);

  // (c) Date added – required
  const [dateAdded, setDateAdded] = useState<string>('');

  // Close popovers on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (tagBoxRef.current && !tagBoxRef.current.contains(e.target as Node)) {
        setOfficialFocus(false);
      }
      if (!(e.target as HTMLElement).closest('.dd-name')) setRepNameOpen(false);
      if (!(e.target as HTMLElement).closest('.dd-desg')) setRepDesgOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Filtering for suggestions
  const officialFiltered = useMemo(() => {
    const q = officialQuery.trim().toLowerCase();
    if (!q) return OFFICIAL_SUGGESTIONS;
    return OFFICIAL_SUGGESTIONS.filter(
      o =>
        o.name.toLowerCase().includes(q) ||
        (o.email ?? '').toLowerCase().includes(q) ||
        (o.empCode ?? '').toLowerCase().includes(q)
    );
  }, [officialQuery]);

  const onAddOfficial = (off: Official) => {
    if (officials.find(o => (o.email && off.email && o.email === off.email) || o.name === off.name)) return;
    setOfficials(prev => [...prev, off]);
    setOfficialQuery('');
  };

  const onAddFromFreeText = () => {
    const q = officialQuery.trim();
    if (!q) return;
    onAddOfficial({ name: q });
  };

  const onTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      onAddFromFreeText();
    } else if (e.key === 'Backspace' && !officialQuery) {
      setOfficials(prev => prev.slice(0, -1));
    }
  };

  const removeOfficial = (idx: number) =>
    setOfficials(prev => prev.filter((_, i) => i !== idx));

  const addRep = () => {
    const nameVal = repName.trim();
    const desgVal = repDesg.trim();
    if (!nameVal || !desgVal) return;
    setReps(prev => [...prev, { name: nameVal, designation: desgVal }]);
    setRepName('');
    setRepDesg('');
  };

  const removeRep = (idx: number) =>
    setReps(prev => prev.filter((_, i) => i !== idx));

  // The form is valid if a date has been selected
  const formValid = !!dateAdded;

  const onSave = () => {
    // hook API here
    // eslint-disable-next-line no-console
    console.log('Step2 Save', { ctpt, officials, reps, dateAdded });
    alert('Saved.');
  };
  const goNext = () => {
    if (!formValid) return;
    history.push(`/call-report/step-3/${encodeURIComponent(ctpt)}`);
  };

  return (
    <>
      <style>
        {`
        .date-input-container {
            position: relative;
        }

        .date-input {
            width: 100%;
            height: 48px;
            padding: 10px 16px;
            font-size: 14px;
            border: 1px solid #e5eaf4;
            border-radius: 12px;
            box-shadow: 0 1px 2px rgba(7, 21, 42, 0.04);
            box-sizing: border-box;
            background: #fff;
            color: #333;
            cursor: pointer;
        }

        /* Hide the native calendar icon */
        .date-input::-webkit-calendar-picker-indicator {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            color: transparent;
            cursor: pointer;
        }
        
        /* Style the placeholder text */
        .date-input::before {
            content: attr(placeholder);
            color: #a7b1c7;
            pointer-events: none;
            display: block;
            width: 100%;
            height: 100%;
            line-height: 28px;
        }

        /* Show the value after selecting a date */
        .date-input:focus::before,
        .date-input:valid::before {
            content: '';
            display: none;
        }

        /* Custom calendar icon styling */
        .date-input-container::after {
            content: '📅';
            font-size: 20px;
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #a7b1c7;
            pointer-events: none;
        }
        `}
      </style>
      <AppHeader title="Call Report" onBack={() => history.goBack()} />
      <IonContent className="cr2-content">
        <div className="page-shell">
          {/* CTPT badge */}
          <div className="ctpt-row bounded">
            <span className="ctpt-badge">CTPT- <strong>{(ctpt || '').toUpperCase()}</strong></span>
          </div>

          {/* head */}
          <div className="cr2-top bounded">
            <h2 className="cr2-h">General Details <span className="muted">(b)</span></h2>
            <div className="page-count">Page <strong>2</strong> of <strong>8</strong></div>
          </div>
          <div className="cr2-subnote bounded">All <span className="req">*</span> fields are mandatory</div>

          {/* Section: Tag Input */}
          <section className="card bounded">
            <div className="card-h">
              Name of Visiting Bank Official / Other Officials / Higher Authorities who accompanied:
            </div>

            <div className="tag-area" ref={tagBoxRef}>
              <div className="tag-list">
                {officials.map((o, i) => {
                  const label = o.email
                    ? `${o.name} · ${o.email}${o.empCode ? ` · (${o.empCode})` : ''}`
                    : o.name;
                  return (
                    <span className="tag" key={`${o.name}-${i}`}>
                      {label}
                      <button className="x" onClick={() => removeOfficial(i)} aria-label="Remove">×</button>
                    </span>
                  );
                })}
                <input
                  className="tag-input"
                  placeholder="Enter Official ID…"
                  value={officialQuery}
                  onChange={e => setOfficialQuery(e.target.value)}
                  onFocus={() => setOfficialFocus(true)}
                  onKeyDown={onTagKey}
                />
              </div>

              {/* suggestions */}
              {officialFocus && (
                <div className="tag-suggest">
                  {officialFiltered.map((o, i) => (
                    <div className="s-item" key={i} onMouseDown={() => onAddOfficial(o)}>
                      <div className="s-name">{o.name}</div>
                      <div className="s-meta">
                        {o.email && <span>{o.email}</span>}
                        {o.empCode && <span>· {o.empCode}</span>}
                        {o.designation && <span>· {o.designation}</span>}
                      </div>
                    </div>
                  ))}
                  {officialFiltered.length === 0 && (
                    <div className="s-empty">No matches — press Enter to add “{officialQuery}”.</div>
                  )}
                </div>
              )}
            </div>

            {/* table of captured officials */}
            <div className="table-wrap mt10">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="w-code">Employee Code</th>
                    <th className="w-desg">Designation</th>
                  </tr>
                </thead>
                <tbody>
                  {officials.map((o, idx) => (
                    <tr key={idx}>
                      <td>{o.name}</td>
                      <td className="w-code">{o.empCode ?? '—'}</td>
                      <td className="w-desg">{o.designation ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Company reps met */}
          <section className="card bounded">
            <div className="card-h">
              Name of Officials / Representative / Owner of the Company met:
            </div>

            <div className="rep-form">
              {/* Name (dropdown + free-text) */}
              <div className="field dd-name">
                <label>Name</label>
                <div className="dropdown">
                  <input
                    value={repName}
                    onChange={(e) => setRepName(e.target.value)}
                    placeholder="Select / Enter Name"
                    onFocus={() => setRepNameOpen(true)}
                  />
                  {repNameOpen && (
                    <div className="menu">
                      {REP_NAME_OPTIONS.map(o => (
                        <div key={o} className="menu-item" onMouseDown={() => { setRepName(o.startsWith('Other:') ? '' : o); setRepNameOpen(false); }}>
                          {o}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Designation (dropdown + free-text) */}
              <div className="field dd-desg">
                <label>Designation</label>
                <div className="dropdown">
                  <input
                    value={repDesg}
                    onChange={(e) => setRepDesg(e.target.value)}
                    placeholder="Select / Enter Designation"
                    onFocus={() => setRepDesgOpen(true)}
                  />
                  {repDesgOpen && (
                    <div className="menu">
                      {REP_DESG_OPTIONS.map(o => (
                        <div key={o} className="menu-item" onMouseDown={() => { setRepDesg(o.startsWith('Other:') ? '' : o); setRepDesgOpen(false); }}>
                          {o}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-ops">
                <button className="btn small" onClick={addRep}>＋ Add New</button>
              </div>
            </div>

            {/* reps table */}
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th className="w-desg">Designation</th>
                    <th className="w-act"></th>
                  </tr>
                </thead>
                <tbody>
                  {reps.map((r, i) => (
                    <tr key={`${r.name}-${i}`}>
                      <td>{r.name}</td>
                      <td className="w-desg">{r.designation}</td>
                      <td className="w-act">
                        <button className="icon danger" onClick={() => removeRep(i)} title="Delete">🗑</button>
                      </td>
                    </tr>
                  ))}
                  {reps.length === 0 && <tr><td colSpan={3} className="empty">No entries yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>

          {/* Date */}
          <div className="field bounded">
            <label>Date Added:<span className="req">*</span></label>
            <div className="date-input-container">
              <input
                className="date-input"
                type="date"
                value={dateAdded}
                onChange={(e) => setDateAdded(e.target.value)}
                placeholder="dd/mm/yyyy"
              />
            </div>
          </div>

          {/* Actions (in-flow; sits above footer because of IonContent bottom padding) */}
          <div className="cr2-actions bounded">
            <button className="btn ghost big" onClick={() => history.push(`/call-report/step-1/${encodeURIComponent(ctpt)}`)}>Back</button>
            <button className="btn big" onClick={() => onSave()}>Save</button>
            <button className={`btn big ${!formValid ? 'disabled' : ''}`} disabled={!formValid} onClick={goNext}>Next</button>
          </div>

          {/* Spacer so you can always scroll past the buttons on small screens */}
          <div className="below-actions-spacer" />
        </div>
      </IonContent>
    </>
  );
}
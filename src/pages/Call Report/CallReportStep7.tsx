import React, { useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { IonContent } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './call-report-step7.css';

type YesNo = '' | 'yes' | 'no';

type Collateral = {
  id: string;
  type: string;
  owner: string;
  address: string;
  occupancy: 'Occupied' | 'Vacant';
  demarcated: YesNo;
  dateAdded: string;
};

const PROPOSAL_TYPES = ['— Select —', 'Fresh Proposal', 'Enhancement', 'Renewal', 'Takeover'];

export default function CallReportStep7() {
  const history = useHistory();
  const { ctpt } = useParams<{ ctpt: string }>();

  const [proposalType, setProposalType] = useState<string>(PROPOSAL_TYPES[0]);
  const [remarks, setRemarks] = useState('');

  const initialList = useMemo<Collateral[]>(
    () => [
      {
        id: 'COL-3245',
        type: 'Residential Property',
        owner: 'Ram Kumar',
        address: 'Mazagon Dock Shipbuilders, Mumbai, Maharashtra - 400615 ( Factory )',
        occupancy: 'Occupied',
        demarcated: '',
        dateAdded: '19 Feb 2025',
      },
      {
        id: 'COL-3246',
        type: 'Residential Property',
        owner: 'Ram Kumar',
        address: 'Mazagon Dock Shipbuilders, Mumbai, Maharashtra - 400615 ( Factory )',
        occupancy: 'Occupied',
        demarcated: '',
        dateAdded: '19 Feb 2025',
      },
    ],
    []
  );
  const [collaterals, setCollaterals] = useState<Collateral[]>(initialList);

  const setDemarcated = (idx: number, v: YesNo) =>
    setCollaterals(prev => prev.map((c, i) => (i === idx ? { ...c, demarcated: v } : c)));

  const onSave = () => {
    console.log('Step7 Save', { ctpt, proposalType, remarks, collaterals });
    alert('Saved.');
  };

  const goBack = () => history.push(`/call-report/step-6/${encodeURIComponent(ctpt)}`);
  const goNext = () => history.push(`/call-report/step-8/${encodeURIComponent(ctpt)}`);

  return (
    <>
      <AppHeader title="Call Report" onBack={() => history.goBack()} />

      <IonContent className="cr7-content">
        <div className="page-shell">
          {/* CTPT + top */}
          <div className="ctpt-row bounded">
            <span className="ctpt-badge">CTPT- <strong>{ctpt}</strong></span>
          </div>

          <div className="cr7-top bounded">
            <h2 className="cr7-h">Collateral Visits</h2>
            <div className="page-count">Page <strong>7</strong> of <strong>8</strong></div>
          </div>
          <div className="cr7-subnote bounded">All <span className="req">*</span> fields are mandatory</div>

          {/* Proposal Type */}
          <div className="field bounded">
            <label>Proposal Type:</label>
            <div className="select-wrap">
              <select value={proposalType} onChange={(e) => setProposalType(e.target.value)}>
                {PROPOSAL_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <span className="chev">▾</span>
            </div>
          </div>

          {/* Collateral cards */}
          <div className="collat-list bounded">
            {collaterals.map((c, i) => (
              <article className="collat-card" key={`${c.id}-${i}`}>
                <div className="meta-grid">
                  <div className="kv"><span className="k">Collateral ID:</span><a className="v link">{c.id}</a></div>
                  <div className="kv"><span className="k">Collateral Type:</span><span className="v">{c.type}</span></div>
                  <div className="kv"><span className="k">Owner of property:</span><span className="v">{c.owner}</span></div>
                </div>

                <div className="addr">
                  <span className="k">Address of the Property:</span>
                  <p className="v">{c.address}</p>
                </div>

                <div className="foot-row">
                  <div className="occ"><span className="k">Occupancy:</span><span className="v">{c.occupancy}</span></div>
                  <div className="demarc">
                    <span className="k">Demarcated:</span>
                    <label className="yn-box">
                      <input type="checkbox" checked={c.demarcated === 'yes'}
                        onChange={() => setDemarcated(i, c.demarcated === 'yes' ? '' : 'yes')} />
                      <span>Yes</span>
                    </label>
                    <label className="yn-box">
                      <input type="checkbox" checked={c.demarcated === 'no'}
                        onChange={() => setDemarcated(i, c.demarcated === 'no' ? '' : 'no')} />
                      <span>No</span>
                    </label>
                  </div>
                  <div className="date"><span className="k">Date added:</span><span className="v">{c.dateAdded}</span></div>
                </div>
              </article>
            ))}
          </div>

          {/* Remarks */}
          <div className="field bounded">
            <label>Remarks (If Any):</label>
            <textarea
              className="ta"
              placeholder="Add Comments"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* ===== Sticky actions (always visible) ===== */}
          <div className="cr7-sticky-actions">
            <div className="bounded cr7-actions-inner">
              <button className="btn ghost big" onClick={goBack}>Back</button>
              <div className="spacer" />
              <button className="btn grad big" onClick={onSave}>Save</button>
              <button className="btn grad big" onClick={goNext}>Next</button>
            </div>
          </div>

          {/* Spacer so the last card/textarea never hides under the sticky bar */}
          <div className="after-actions-spacer" />
        </div>
      </IonContent>

    </>
  );
}

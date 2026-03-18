import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { IonContent } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './call-report-step5.css';

type YesNo = '' | 'yes' | 'no';

export default function CallReportStep5() {
  const history = useHistory();
  const { ctpt } = useParams<{ ctpt: string }>();

  // Read-only (auto fetched)
  const [bscScore] = useState<string>('67');
  const [churnAmt] = useState<string>('450');
  const [churnPct] = useState<string>('48');

  // Inputs
  const [correctiveAction, setCorrectiveAction] = useState('');
  const [lessChurnReason, setLessChurnReason] = useState('');
  const [otherConcern, setOtherConcern] = useState<YesNo>('');
  const [remarks, setRemarks] = useState('');
  const [adverse, setAdverse] = useState('');

  const formValid = true;

  const onSave = () => {
    console.log('Step5 Save', {
      ctpt, bscScore, churnAmt, churnPct, correctiveAction,
      lessChurnReason, otherConcern, remarks, adverse
    });
    alert('Saved.');
  };

  const goBack = () => history.push(`/call-report/step-4/${encodeURIComponent(ctpt)}`);
  const goNext = () => history.push(`/call-report/step-6/${encodeURIComponent(ctpt)}`);

  return (
    <>
      <AppHeader title="Call Report" onBack={() => history.goBack()} />

      <IonContent className="cr5-content">
        <div className="page-shell">
          {/* Top */}
          <div className="topbar bounded">
            <h2 className="cr5-h">Banking Details</h2>
            <div className="topbar-rt">
              <span className="page-count">Page <strong>5</strong> of <strong>8</strong></span>
              <span className="ctpt-badge">CTPT- <strong>{ctpt}</strong></span>
            </div>
          </div>
          <div className="cr5-subnote bounded">All <span className="req">*</span> fields are mandatory</div>

          {/* BSC Score (readonly) */}
          <div className="field bounded">
            <label>BSC Score:</label>
            <input className="pill readonly" readOnly value={bscScore} />
          </div>

          {/* Corrective action */}
          <div className="field bounded">
            <label>If BSC score is poor then corrective action planned post customer discussion:</label>
            <textarea
              className="ta"
              placeholder="Add Comments"
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
            />
          </div>

          {/* Churning amount + % (readonly) */}
          <div className="grid-2 bounded">
            <div className="field">
              <label>Churning Amount (In Lacs):</label>
              <input className="pill readonly" readOnly value={churnAmt} />
            </div>
            <div className="field">
              <label>Churning%:</label>
              <input className="pill readonly" readOnly value={churnPct} />
            </div>
          </div>

          {/* Reason of less churning */}
          <div className="field bounded">
            <label>Reason of less churning (in case &lt; 50%):</label>
            <textarea
              className="ta"
              placeholder="Add Comments"
              value={lessChurnReason}
              onChange={(e) => setLessChurnReason(e.target.value)}
            />
          </div>

          {/* Any other concern Yes/No */}
          <div className="field bounded">
            <label>Any other concern in Banking?</label>
            <div className="yn-boxes">
              <label className="yn-box">
                <input
                  type="checkbox"
                  checked={otherConcern === 'yes'}
                  onChange={() => setOtherConcern(otherConcern === 'yes' ? '' : 'yes')}
                />
                <span>Yes</span>
              </label>
              <label className="yn-box">
                <input
                  type="checkbox"
                  checked={otherConcern === 'no'}
                  onChange={() => setOtherConcern(otherConcern === 'no' ? '' : 'no')}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Remarks */}
          <div className="field bounded">
            <label>Remarks:</label>
            <textarea
              className="ta"
              placeholder="Add Comments"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* Adverse Feature */}
          <div className="field bounded">
            <label>Any Adverse Feature observed?</label>
            <textarea
              className="ta"
              placeholder="Add Comments"
              value={adverse}
              onChange={(e) => setAdverse(e.target.value)}
            />
          </div>

          {/* ===== Sticky actions (always visible) ===== */}
          <div className="cr5-sticky-actions">
            <div className="bounded cr5-actions-inner">
              <button className="btn ghost big" onClick={goBack}>Back</button>
              <div className="spacer" />
              <button className="btn grad big" onClick={onSave}>Save</button>
              <button className="btn grad big" disabled={!formValid} onClick={goNext}>Next</button>
            </div>
          </div>

          {/* Spacer so last textarea never hides under sticky bar */}
          <div className="after-actions-spacer" />
        </div>
      </IonContent>

      {/* If your app uses a fixed footer globally, keep it here */}
   
    </>
  );
}

import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { IonContent } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './call-report-step4.css';

type YesNo = '' | 'yes' | 'no';

export default function CallReportStep4() {
  const history = useHistory();
  const { ctpt } = useParams<{ ctpt: string }>();

  const [stockValue, setStockValue] = useState<string>('');
  const [goodCondition, setGoodCondition] = useState<YesNo>('');
  const [comments, setComments] = useState<string>('');

  const formValid = true; // screenshot shows no required validators beyond step note

  const onSave = () => {
    // hook API here
    // eslint-disable-next-line no-console
    console.log('Step4 Save', { ctpt, stockValue, goodCondition, comments });
    alert('Saved.');
  };

  const goBack = () => history.push(`/call-report/step-3/${encodeURIComponent(ctpt)}`);
  const goNext = () => history.push(`/call-report/step-5/${encodeURIComponent(ctpt)}`);

  return (
    <>
      <AppHeader title="Call Report" onBack={() => history.goBack()} />

      <IonContent className="cr4-content">
        <div className="page-shell">
          {/* CTPT badge */}
          <div className="ctpt-row bounded">
            <span className="ctpt-badge">CTPT- <strong>{ctpt}</strong></span>
          </div>

          {/* Head */}
          <div className="cr4-top bounded">
            <h2 className="cr4-h">Comments on Stock level</h2>
            <div className="page-count">Page <strong>4</strong> of <strong>8</strong></div>
          </div>
          <div className="cr4-subnote bounded">All <span className="req">*</span> fields are mandatory</div>

          {/* Total value */}
          <div className="field bounded">
            <label>Total Value of Stock observed (In Lakhs):</label>
            <input
              className="pill"
              placeholder="Enter Value"
              inputMode="decimal"
              value={stockValue}
              onChange={(e) => {
                const v = e.target.value.replace(/[^0-9.]/g, '');
                const fixed = v.split('.').length > 2 ? v.replace(/\.(?=.*\.)/g, '') : v;
                setStockValue(fixed);
              }}
            />
          </div>

          {/* Good condition? (Yes/No as small boxes per screenshot) */}
          <div className="field bounded">
            <label>Is the stock is maintained in good condition?</label>
            <div className="yn-boxes">
              <label className="yn-box">
                <input
                  type="checkbox"
                  checked={goodCondition === 'yes'}
                  onChange={() => setGoodCondition(goodCondition === 'yes' ? '' : 'yes')}
                />
                <span>Yes</span>
              </label>
              <label className="yn-box">
                <input
                  type="checkbox"
                  checked={goodCondition === 'no'}
                  onChange={() => setGoodCondition(goodCondition === 'no' ? '' : 'no')}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Comments */}
          <div className="field bounded">
            <label>Specific comments on inventory - if any:</label>
            <textarea
              className="ta"
              placeholder="Add Comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="cr4-actions bounded">
            <button className="btn ghost big" onClick={goBack}>Back</button>
            <button className="btn big" onClick={onSave}>Save</button>
            <button className={`btn big ${!formValid ? 'disabled' : ''}`} disabled={!formValid} onClick={goNext}>Next</button>
          </div>
        </div>
      </IonContent>

    </>
  );
}

import React, { useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { IonContent } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './call-report-step6.css';

type TabKey = 'root' | 'items';

type PDD = {
  id: string;           // e.g., CNDT- 042023
  originalDue: string;  // e.g., 9-11-2025
  text: string;         // description
  closurePlan: string;  // editable notes
};

export default function CallReportStep6() {
  const history = useHistory();
  const { ctpt } = useParams<{ ctpt: string }>();

  // Tabs
  const [tab, setTab] = useState<TabKey>('root');

  // Mock list of open PDDs
  const initialPdds = useMemo<PDD[]>(
    () => [
      {
        id: 'CNDT- 042023',
        originalDue: '9-11-2025',
        text:
          'The borrower to close following account number within below mentioned period of availing of aforesaid facilities from AU Small Finance Bank (AUSFB). In case borrower fail to comply, the condition AUSFB shall have right to levy below mentioned penal interest till the time of non compliance…',
        closurePlan: '',
      },
      {
        id: 'CNDT- 042027',
        originalDue: '12-10-2025',
        text:
          'CA Certificate / GST returns for period from ___ to ___ 2019 having aggregate turnover of Rs. ____ is to be obtained prior to disbursement.',
        closurePlan: '',
      },
    ],
    []
  );
  const [pdds, setPdds] = useState<PDD[]>(initialPdds);

  // Modal state
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draftPlan, setDraftPlan] = useState<string>('');

  const openDialog = (idx: number) => {
    setEditingIdx(idx);
    setDraftPlan(pdds[idx].closurePlan || '');
  };
  const closeDialog = () => {
    setEditingIdx(null);
    setDraftPlan('');
  };
  const saveDialog = () => {
    if (editingIdx === null) return;
    setPdds(prev =>
      prev.map((p, i) => (i === editingIdx ? { ...p, closurePlan: draftPlan.trim() } : p))
    );
    closeDialog();
  };

  const onSave = () => {
    // TODO: wire API
    // eslint-disable-next-line no-console
    console.log('Step6 Save', { ctpt, pdds, tab });
    alert('Saved.');
  };

  const goBack = () => history.push(`/call-report/step-5/${encodeURIComponent(ctpt)}`);
  const goNext = () => history.push(`/call-report/step-7/${encodeURIComponent(ctpt)}`);

  return (
    <>
      <AppHeader title="Call Report" onBack={() => history.goBack()} />

      <IonContent className="cr6-content">
        <div className="page-shell">
          {/* CTPT */}
          <div className="ctpt-row bounded">
            <span className="ctpt-badge">CTPT- <strong>{ctpt}</strong></span>
          </div>

          {/* Header */}
          <div className="cr6-top bounded">
            <h2 className="cr6-h">Other details</h2>
            <div className="page-count">Page <strong>6</strong> of <strong>8</strong></div>
          </div>
          <div className="cr6-subnote bounded">All <span className="req">*</span> fields are mandatory</div>

          {/* Tabs */}
          <div className="tabs bounded" role="tablist" aria-label="Other details tabs">
            <button
              role="tab"
              aria-selected={tab === 'root'}
              className={`tab ${tab === 'root' ? 'active' : ''}`}
              onClick={() => setTab('root')}
            >
              Root
            </button>
            <button
              role="tab"
              aria-selected={tab === 'items'}
              className={`tab ${tab === 'items' ? 'active' : ''}`}
              onClick={() => setTab('items')}
            >
              Items
            </button>
          </div>

          {/* Root tab content */}
          {tab === 'root' && (
            <section className="bounded">
              <div className="sec-h">Open PDDs and closure plan:</div>

              <div className="pdd-list">
                {pdds.map((p, i) => (
                  <article className="pdd-card" key={p.id}>
                    <div className="pdd-row">
                      <div className="meta">
                        <div className="kv">
                          <span className="k">Unique-ID:</span>
                          <span className="v">{p.id}</span>
                        </div>
                        <div className="kv">
                          <span className="k">Original Due Date:</span>
                          <span className="v">{p.originalDue}</span>
                        </div>
                      </div>

                      <button className="closure-btn" onClick={() => openDialog(i)}>
                        Closure Plan <span className="pen" aria-hidden>✎</span>
                      </button>
                    </div>

                    <div className="text">
                      <span className="k">Text:</span>
                      <p>{p.text}</p>
                    </div>

                    {p.closurePlan && (
                      <div className="plan">
                        <span className="k">Saved Closure Plan:</span>
                        <p>{p.closurePlan}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Items tab content (placeholder, keep structure consistent) */}
          {tab === 'items' && (
            <section className="bounded">
              <div className="sec-h">Items</div>
              <div className="empty-note">
                No items to display. Switch back to <strong>Root</strong> to manage PDD closure plans.
              </div>
            </section>
          )}

          {/* Actions */}
          <div className="cr6-actions bounded">
            <button className="btn ghost big" onClick={goBack}>Back</button>
            <button className="btn big" onClick={onSave}>Save</button>
            <button className="btn big" onClick={goNext}>Next</button>
          </div>
        </div>
      </IonContent>

      {/* Modal */}
      {editingIdx !== null && (
        <div className="dlg-overlay" role="dialog" aria-modal="true">
          <div className="dlg">
            <div className="dlg-h">
              <strong>Closure Plan</strong>
              <button className="x" aria-label="Close" onClick={closeDialog}>×</button>
            </div>
            <div className="dlg-b">
              <textarea
                placeholder="Add Comments"
                value={draftPlan}
                onChange={(e) => setDraftPlan(e.target.value)}
              />
            </div>
            <div className="dlg-f">
              <button className="btn" onClick={saveDialog}>SAVE</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

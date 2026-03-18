import React, { useMemo, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './call-report-list.css';

/* ===== Types ===== */
type Condition = { id: string; code: string; text: string; due?: string };
type CustomerRow = {
  id: string;
  customer: string;
  initials: string;
  ctptId: string;
  callReportId: string;
  dateCompleted?: string;
  status: 'Completed' | 'Draft';
  conditions?: Condition[];
};

/* ===== Mock data (swap with API) ===== */
const seed: CustomerRow[] = [
  {
    id: 'cust-rk',
    customer: 'RK Enterprises',
    initials: 'RK',
    ctptId: 'CTPT- 2344',
    callReportId: 'CR-1234',
    dateCompleted: '19-02-2025',
    status: 'Completed',
    conditions: [
      { id: 'c1', code: 'CNDI-23456', text: 'CA Certificate / GST returns for period … ; to be obtained prior to disbursement.', due: '22-09-2025' },
      { id: 'c2', code: 'CNDI-23457', text: 'Stock statement of borrowing base; submit on monthly basis. Cut-off date for submission is 15th of every month.', due: '22-09-2025' },
      { id: 'c3', code: 'CNDI-23458', text: 'Condition 3 – GST Reco (Q4).', due: '26-02-2025' }
    ]
  },
  {
    id: 'cust-re',
    customer: 'Ram Enterprises',
    initials: 'RE',
    ctptId: 'CTPT- 2345',
    callReportId: 'CR-1235',
    dateCompleted: '15-02-2025',
    status: 'Completed',
    conditions: [
      { id: 'c4', code: 'CNDI-24001', text: 'Upload latest insurance copy and renewal receipt.', due: '20-02-2025' }
    ]
  },
  {
    id: 'cust-se',
    customer: 'Shyam Enterprises',
    initials: 'SE',
    ctptId: 'CTPT- 2346',
    callReportId: 'CR-1236',
    dateCompleted: '10-02-2025',
    status: 'Draft'
  }
];

const CREDIT_MANAGERS = [
  { id: 'cm1', name: 'Rakesh Sharma - 230445' },
  { id: 'cm2', name: 'Ananya Gupta - 220118' },
  { id: 'cm3', name: 'Vikram Iyer - 210772' }
];

const CallReportsList: React.FC = () => {
  const history = useHistory();

  const [activeTab, setActiveTab] = useState<'Completed' | 'Drafts'>('Completed');
  const [q, setQ] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedConditionIds, setSelectedConditionIds] = useState<Set<string>>(new Set());
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'cm' | 'abort'>('cm');
  const [selectedCMId, setSelectedCMId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; msg: string; color?: string }>({ open: false, msg: '' });

  // counts just for tab badges (visual only)
  const counts = useMemo(() => ({
    completed: seed.filter(r => r.status === 'Completed').length,
    drafts: seed.filter(r => r.status === 'Draft').length
  }), []);

  const data = useMemo(() => {
    const base = seed.filter(r => (activeTab === 'Completed' ? r.status === 'Completed' : r.status === 'Draft'));
    if (!q.trim()) return base;
    const k = q.toLowerCase();
    return base.filter(r =>
      r.customer.toLowerCase().includes(k) ||
      r.ctptId.toLowerCase().includes(k) ||
      r.callReportId.toLowerCase().includes(k)
    );
  }, [activeTab, q]);

  const onRefresh = (ev: CustomEvent) => {
    setTimeout(() => {
      (ev.detail as any).complete();
      setToast({ open: true, msg: 'Refreshed', color: 'success' });
    }, 600);
  };

  const toggleExpand = (custId: string, enabled: boolean) => {
    if (!enabled) return;
    setExpanded(prev => ({ ...prev, [custId]: !prev[custId] }));
  };

  const clearSelections = () => {
    setSelectedCustomerId(null);
    setSelectedConditionIds(new Set());
  };

  const toggleCondition = (custId: string, condId: string) => {
    if (selectedCustomerId && selectedCustomerId !== custId) {
      setSelectedCustomerId(custId);
      setSelectedConditionIds(new Set([condId]));
      return;
    }
    if (!selectedCustomerId) {
      setSelectedCustomerId(custId);
      setSelectedConditionIds(new Set([condId]));
      return;
    }
    setSelectedConditionIds(prev => {
      const next = new Set(prev);
      next.has(condId) ? next.delete(condId) : next.add(condId);
      return next;
    });
  };

  const canSend = selectedCustomerId && selectedConditionIds.size > 0;

  const openAction = () => {
    if (!canSend) {
      setToast({ open: true, msg: 'Select at least one condition', color: 'warning' });
      return;
    }
    setShowActionModal(true);
  };

  const handleAction = () => {
    if (actionType === 'abort') {
      setShowActionModal(false);
      clearSelections();
      setToast({ open: true, msg: 'Aborted', color: 'medium' });
      return;
    }
    if (!selectedCMId) {
      setToast({ open: true, msg: 'Select a Credit Manager', color: 'warning' });
      return;
    }
    setShowActionModal(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      clearSelections();
      setSelectedCMId('');
      setActionType('cm');
      setToast({ open: true, msg: 'Sent to CM', color: 'success' });
    }, 1000);
  };

  return (
    <IonPage className="cr-page">
      <div className="header-sticky">
        <AppHeader
          title="Call Reports"
          // ✅ Updated to use the reliable navigation method
          onBack={() => {
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 100);
          }}
        />
      </div>

      <IonContent fullscreen className="with-header with-footer" scrollEvents={true}>
        <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="bound">
          {/* Title + Tabs */}
          <div className="title-row">
            {/* UPDATED: Back goes to the dashboard route */}
            

            <div className="tabs" role="tablist" aria-label="Report status">
              <button
                role="tab"
                className={`tab ${activeTab === 'Completed' ? 'on' : ''}`}
                aria-selected={activeTab === 'Completed'}
                onClick={() => setActiveTab('Completed')}
              >
                Completed <span className="tab-badge">{counts.completed}</span>
              </button>
              <button
                role="tab"
                className={`tab ${activeTab === 'Drafts' ? 'on' : ''}`}
                aria-selected={activeTab === 'Drafts'}
                onClick={() => setActiveTab('Drafts')}
              >
                Drafts <span className="tab-badge">{counts.drafts}</span>
              </button>
            </div>
          </div>

          {/* Search + Sort */}
          <div className="tools-row">
            <IonSearchbar
              value={q}
              onIonInput={(e) => setQ(e.detail.value ?? '')}
              placeholder="Search by customer, CTPT or Report ID"
              className="search"
              debounce={150}
            />
            <button className="sort" aria-label="Sort By">
              <span aria-hidden="true" className="sort-ico" />
              <span className="sort-text">Sort By</span>
            </button>
          </div>

          {/* Customer cards */}
          <div className="list">
            {data.map(row => {
              const isCompleted = row.status === 'Completed';
              const open = !!expanded[row.id];
              return (
                <div key={row.id} className={`cust-card ${open ? 'open' : ''} ${!isCompleted ? 'draft' : ''}`}>
                  <div className="card-head">
                    <button
                      className={`chev ${open ? 'open' : ''}`}
                      onClick={() => toggleExpand(row.id, isCompleted)}
                      aria-label={isCompleted ? (open ? 'Collapse' : 'Expand') : 'Draft'}
                      disabled={!isCompleted}
                    />
                    <div className="avatar">{row.initials}</div>

                    <div className="col grow">
                      <div className="label">Customer Legal Name</div>
                      <div className="value">{row.customer}</div>
                      <div className="date">Date completed: {row.dateCompleted ?? '-'}</div>
                    </div>

                    <div className="col idchip">
                      <div className="label">CTPT- ID</div>
                      <div className="chip linkish">{row.ctptId}</div>
                    </div>

                    <div className="col idchip">
                      <div className="label">Call Report ID</div>
                      <div className="chip linkish">{row.callReportId}</div>
                    </div>
                  </div>

                  {/* Expanded table */}
                  {isCompleted && open && row.conditions?.length ? (
                    <div className="card-expand">
                      <div className="tbl" role="table" aria-label={`Conditions for ${row.customer}`}>
                        <div className="tr head" role="row">
                          <div className="th sel" role="columnheader" aria-label="Select" />
                          <div className="th id" role="columnheader">Condition- ID</div>
                          <div className="th text" role="columnheader">Condition Text</div>
                          <div className="th due" role="columnheader">Due Date</div>
                        </div>

                        {row.conditions.map(c => {
                          const checked = selectedCustomerId === row.id && selectedConditionIds.has(c.id);
                          return (
                            <div className="tr" role="row" key={c.id}>
                              <div className="td sel" role="cell">
                                <input
                                  type="checkbox"
                                  className="sq"
                                  checked={checked}
                                  onChange={() => toggleCondition(row.id, c.id)}
                                  aria-label={`Select ${c.code}`}
                                />
                              </div>
                              <div className="td id" role="cell">{c.code}</div>
                              <div className="td text" role="cell">{c.text}</div>
                              <div className="td due" role="cell">{c.due ?? '-'}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}

            {!data.length && <div className="empty">No results.</div>}
          </div>

          {/* Bottom actions */}
          <div className="page-actions">
            <button className="btn ghost" onClick={clearSelections}>Clear Selections</button>
            <button className="btn primary" onClick={openAction} disabled={!canSend}>Send To</button>
          </div>
        </div>

        {/* Modal */}
        {showActionModal && (
          <div className="modal-backdrop" onClick={() => setShowActionModal(false)}>
            <div className="modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
              <div className="modal-head">
                <h3>Action</h3>
                <button className="x" onClick={() => setShowActionModal(false)} aria-label="Close" />
              </div>

              <div className="modal-body">
                <div className="field">
                  <div className="label">Send to:</div>
                  <div className="pills">
                    <label className={`pill ${actionType === 'cm' ? 'on' : ''}`}>
                      <input type="radio" name="act" checked={actionType === 'cm'} onChange={() => setActionType('cm')} />
                      Credit Manager
                    </label>
                    <label className={`pill ${actionType === 'abort' ? 'on' : ''}`}>
                      <input type="radio" name="act" checked={actionType === 'abort'} onChange={() => setActionType('abort')} />
                      Abort
                    </label>
                  </div>
                </div>

                {actionType === 'cm' && (
                  <div className="field">
                    <div className="label">Select User</div>
                    <div className="select">
                      <select value={selectedCMId} onChange={(e) => setSelectedCMId(e.target.value)}>
                        <option value="">Select…</option>
                        {CREDIT_MANAGERS.map(cm => (
                          <option key={cm.id} value={cm.id}>{cm.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-foot">
                <button className="btn ghost" onClick={() => setShowActionModal(false)}>Cancel</button>
                <button className="btn primary" onClick={handleAction}>Send</button>
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {showSuccess && (
          <div className="success-backdrop">
            <div className="success-card">
              <div className="check">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.285 6.709a1 1 0 0 1 0 1.414l-9.19 9.19a1 1 0 0 1-1.414 0l-5.19-5.19a1 1 0 1 1 1.414-1.414l4.483 4.483 8.483-8.483a1 1 0 0 1 1.414 0Z"/>
                </svg>
              </div>
              <div className="succ-title">Sent to CM</div>
              <button className="btn primary" onClick={() => setShowSuccess(false)}>OK</button>
            </div>
          </div>
        )}

        <IonToast
          isOpen={toast.open}
          message={toast.msg}
          color={toast.color}
          duration={1200}
          onDidDismiss={() => setToast({ open: false, msg: '' })}
        />
      </IonContent>

      <AppFooter active="reports" />
    </IonPage>
  );
};

export default CallReportsList;

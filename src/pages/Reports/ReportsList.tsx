import React, { useMemo, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonActionSheet,
  IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './reports-list.css';

/* ===== Types ===== */
type ReportRow = {
  id: string;
  customer: string;
  initials: string;
  ctptId: string;
  dateCompleted: string;
  dateSubmitted: string;
  linkedCndis: string[];
  sentTo: string; // "Rakesh Sharma - 230445"
  status: 'Completed' | 'Submitted' | 'Draft';
};

/* ===== Seed (replace with API) ===== */
const SEED: ReportRow[] = [
  {
    id: 'r1',
    customer: 'RK Enterprises',
    initials: 'RK',
    ctptId: 'CTPT- 2344',
    dateCompleted: '10-08-2025',
    dateSubmitted: '13-08-2025',
    linkedCndis: ['CNDI- 23447', 'CNDI- 23447'],
    sentTo: 'Rakesh Sharma - 230445',
    status: 'Completed'
  },
  {
    id: 'r2',
    customer: 'RK Enterprises',
    initials: 'RK',
    ctptId: 'CTPT- 2344',
    dateCompleted: '10-08-2025',
    dateSubmitted: '13-08-2025',
    linkedCndis: ['CNDI- 23447', 'CNDI- 23447'],
    sentTo: 'Rakesh Sharma - 230445',
    status: 'Submitted'
  },
  {
    id: 'r3',
    customer: 'RK Enterprises',
    initials: 'RK',
    ctptId: 'CTPT- 2344',
    dateCompleted: '10-08-2025',
    dateSubmitted: '13-08-2025',
    linkedCndis: ['CNDI- 23447', 'CNDI- 23447'],
    sentTo: 'Rakesh Sharma - 230445',
    status: 'Draft'
  }
];

const ReportsList: React.FC = () => {
  const history = useHistory();

  const [q, setQ] = useState('');
  const [showSheet, setShowSheet] = useState(false);
  const [toast, setToast] = useState<{open:boolean; msg:string; color?:string}>({open:false, msg:''});

  const data = useMemo(() => {
    if (!q.trim()) return SEED;
    const k = q.toLowerCase();
    return SEED.filter(r =>
      r.customer.toLowerCase().includes(k) ||
      r.ctptId.toLowerCase().includes(k) ||
      r.sentTo.toLowerCase().includes(k)
    );
  }, [q]);

  const onRefresh = (ev: CustomEvent) => {
    setTimeout(() => {
      (ev.detail as any).complete();
      setToast({open:true, msg:'Refreshed', color:'success'});
    }, 600);
  };

  const handleDownload = (type: 'PDF' | 'Excel') => {
    setShowSheet(false);
    setToast({open:true, msg:`Preparing ${type}…`, color:'medium'});
    // hook your file generation here
  };

  const statusChip = (s: ReportRow['status']) => {
    const map = {
      Completed: 'chip success',
      Submitted: 'chip submitted',
      Draft: 'chip draft'
    } as const;
    return <span className={map[s]}>{s}</span>;
  };

  return (
    <IonPage className="reports-page">
      <div className="header-sticky">
        <AppHeader
          title="Reports"
          // ✅ New: Added the onBack prop with the reliable navigation method
          onBack={() => {
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 100);
          }}
        />
      </div>

      <IonContent fullscreen className="content-with-footer with-header">
        <IonRefresher slot="fixed" onIonRefresh={onRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="bounded">
          {/* Title row */}

          {/* Tools row */}
          <div className="tools-row">
            <IonSearchbar
              value={q}
              onIonInput={(e) => setQ(e.detail.value ?? '')}
              placeholder="Search"
              className="search"
              debounce={150}
            />
            <button className="sort" aria-label="Sort By">
              <span aria-hidden="true" className="sort-ico" />
              <span className="sort-text">Sort By</span>
            </button>
          </div>

          {/* List */}
          <div className="report-list">
            {data.map(r => (
              <div key={r.id} className="report-card">
                <div className="report-head">
                  <div className="avatar">{r.initials}</div>

                  <div className="rcol grow">
                    <div className="muted">Customer Legal Name</div>
                    <div className="val">{r.customer}</div>
                  </div>

                  <div className="rcol">
                    <div className="muted">CTPT-ID:</div>
                    <div className="linkish">{r.ctptId}</div>
                  </div>

                  <div className="rcol status">
                    <div className="muted">Call Report Status:</div>
                    {statusChip(r.status)}
                  </div>
                </div>

                <div className="report-body">
                  <div className="row">
                    <div className="item">
                      <div className="muted">Date of completion</div>
                      <div className="val">{r.dateCompleted}</div>
                    </div>
                    <div className="item">
                      <div className="muted">Date of Submission</div>
                      <div className="val">{r.dateSubmitted}</div>
                    </div>
                    <div className="item">
                      <div className="muted">Linked CNDIs:</div>
                      <div className="val">{r.linkedCndis.join(', ')}</div>
                    </div>
                  </div>

                  <div className="sent">
                    <span className="muted">Sent to CM:</span>&nbsp;
                    <span className="linkish">{r.sentTo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Download button (global) */}
          <div className="download-wrap">
            <button className="btn download" onClick={() => setShowSheet(true)}>
              <span className="dl-ico" aria-hidden="true" /> Download PDF
            </button>
          </div>
        </div>

        {/* Download chooser */}
        <IonActionSheet
          isOpen={showSheet}
          onDidDismiss={() => setShowSheet(false)}
          header="Download"
          buttons={[
            { text: 'PDF', handler: () => handleDownload('PDF') },
            { text: 'Excel', handler: () => handleDownload('Excel') },
            { text: 'Cancel', role: 'cancel' }
          ]}
        />

        <IonToast
          isOpen={toast.open}
          message={toast.msg}
          color={toast.color}
          duration={1200}
          onDidDismiss={() => setToast({open:false, msg:''})}
        />
      </IonContent>

      <AppFooter active="reports" />
    </IonPage>
  );
};

export default ReportsList;

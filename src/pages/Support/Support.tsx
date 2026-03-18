import React, { useMemo, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './support.css';

/* ===== Types ===== */
type Faq = { id: string; q: string; a: string; };

/* ===== Seed (replace with API) ===== */
const FAQS: Faq[] = [
  {
    id: 'f1',
    q: 'How do I resume a saved (draft) Call Report?',
    a: 'Go to Call Reports → Drafts tab, locate the customer and tap Resume. Your progress will load from the last saved point.'
  },
  {
    id: 'f2',
    q: 'How can I send conditions to a Credit Manager (CM)?',
    a: 'Open Call Reports → Completed tab → expand a customer → select one or more conditions → tap Send To and choose the CM.'
  },
  {
    id: 'f3',
    q: 'Who can see my submitted reports?',
    a: 'Your line manager and the selected Credit Manager can view the reports you submit, along with audit trails as per policy.'
  }
];

/* ===== Constants (replace with org contacts) ===== */
const SUPPORT_PHONE = '+91 98765 43210';
const SUPPORT_EMAIL = 'support@ausfb.example';

const Support: React.FC = () => {
  const history = useHistory();

  /* Form state */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState<'Low' | 'Normal' | 'High'>('Normal');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const [toast, setToast] = useState<{open:boolean; msg:string; color?:string}>({open:false, msg:''});

  const canSubmit = useMemo(() => {
    return subject.trim().length > 0 && message.trim().length > 0;
  }, [subject, message]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setToast({open:true, msg:'Please fill Subject and Message', color:'warning'});
      return;
    }
    // TODO: connect to API
    setToast({open:true, msg:'Ticket submitted', color:'success'});
    setName(''); setEmail(''); setSubject(''); setCategory('General'); setPriority('Normal'); setMessage(''); setAttachment(null);
    (document.getElementById('support-attach') as HTMLInputElement | null)?.value && ((document.getElementById('support-attach') as HTMLInputElement).value = '');
  };

  return (
    <IonPage className="support-page">
      {/* Keep AppHeader visible */}
      <div className="header-sticky">
        <AppHeader title="Support" />
      </div>

      <IonContent fullscreen className="with-header with-footer">
        <div className="bounded">
          {/* Title + Back */}

          {/* Quick Contact */}
          <section className="contact-grid" aria-label="Quick contact options">
            <button className="contact-card" onClick={() => (window.location.href = `tel:${SUPPORT_PHONE.replace(/\s/g,'')}`)}>
              <div className="ico phone" aria-hidden="true" />
              <div className="cc-head">Call us</div>
              <div className="cc-sub">{SUPPORT_PHONE}</div>
              <div className="cc-note">Mon–Fri · 9:00–18:00</div>
            </button>

            <button className="contact-card" onClick={() => (window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Support%20request`)}>
              <div className="ico mail" aria-hidden="true" />
              <div className="cc-head">Email</div>
              <div className="cc-sub">{SUPPORT_EMAIL}</div>
              <div className="cc-note">We reply within 1 business day</div>
            </button>

            <a className="contact-card" href="#faqs">
              <div className="ico faq" aria-hidden="true" />
              <div className="cc-head">FAQs</div>
              <div className="cc-sub">Browse common questions</div>
              <div className="cc-note">Tap to jump</div>
            </a>
          </section>

          {/* FAQs */}
          <section id="faqs" className="faq-section" aria-label="Frequently Asked Questions">
            <h2 className="sec-title">FAQs</h2>
            <div className="faq-list">
              {FAQS.map(f => (
                <details className="faq-item" key={f.id}>
                  <summary className="faq-head">
                    <span className="q">{f.q}</span>
                    <span className="chev" aria-hidden="true" />
                  </summary>
                  <div className="faq-body">{f.a}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Ticket form */}
          <section className="ticket-section" aria-label="Submit a ticket">
            <h2 className="sec-title">Submit a ticket</h2>

            <form className="ticket-form" onSubmit={onSubmit} noValidate>
              <div className="grid">
                <div className="field">
                  <label className="lbl">Your Name (optional)</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    type="text"
                    inputMode="text"
                    placeholder="John Doe"
                  />
                </div>

                <div className="field">
                  <label className="lbl">Email (optional)</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    type="email"
                    inputMode="email"
                    placeholder="john@company.com"
                  />
                </div>

                <div className="field wide">
                  <label className="lbl">Subject <span className="req">*</span></label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input"
                    type="text"
                    placeholder="Briefly describe the issue"
                    required
                  />
                </div>

                <div className="field">
                  <label className="lbl">Category</label>
                  <div className="select">
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option>General</option>
                      <option>Call Reports</option>
                      <option>My Reports</option>
                      <option>Login & Access</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label className="lbl">Priority</label>
                  <div className="select">
                    <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                      <option>Low</option>
                      <option>Normal</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div className="field wide">
                  <label className="lbl">Message <span className="req">*</span></label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="textarea"
                    rows={5}
                    placeholder="Add details, steps to reproduce, and any IDs (CTPT / CR) that help us investigate."
                    required
                  />
                </div>

                <div className="field wide">
                  <label className="lbl">Attachment (optional)</label>
                  <input
                    id="support-attach"
                    className="file-input"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
                  />
                  {attachment && <div className="file-note">Attached: {attachment.name}</div>}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => {
                    setName(''); setEmail(''); setSubject(''); setCategory('General'); setPriority('Normal'); setMessage(''); setAttachment(null);
                    const el = document.getElementById('support-attach') as HTMLInputElement | null;
                    if (el) el.value = '';
                  }}
                >
                  Clear
                </button>
                <button type="submit" className="btn primary" disabled={!canSubmit}>
                  Submit Ticket
                </button>
              </div>
            </form>
          </section>
        </div>

        <IonToast
          isOpen={toast.open}
          message={toast.msg}
          color={toast.color}
          duration={1400}
          onDidDismiss={() => setToast({open:false, msg:''})}
        />
      </IonContent>

      <AppFooter active="support" />
    </IonPage>
  );
};

export default Support;

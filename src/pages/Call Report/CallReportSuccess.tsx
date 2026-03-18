import React from 'react';
import { useHistory, useParams } from 'react-router';
import { IonContent } from '@ionic/react';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import './call-report-success.css';

export default function CallReportSuccess() {
  const history = useHistory();
  const { cr } = useParams<{ cr?: string }>();

  const onOk = () => {
    // go back to dashboard (change to /my-customers if you prefer)
    history.push('/dashboard');
  };

  return (
    <>
      <AppHeader title="" onBack={() => history.goBack()} />
      <IonContent className="crs-content">
        <div className="success-shell bounded">
          {/* Animated green check */}
          <div className="check-wrap">
            <svg className="check-svg" viewBox="0 0 120 120" aria-hidden>
              <defs>
                <linearGradient id="okGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8BE28B"/>
                  <stop offset="100%" stopColor="#5DCB75"/>
                </linearGradient>
              </defs>
              <circle className="ok-circle" cx="60" cy="60" r="48" fill="url(#okGrad)"/>
              <path
                className="ok-tick"
                d="M38 62 L54 76 L82 46"
                fill="none"
                stroke="#fff"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="ok-title">Call Report Saved!</h2>
          <div className="ok-sub">CR- {cr ?? '4321'}</div>

          <div className="ok-actions">
            <button className="btn big" onClick={onOk}>OK</button>
          </div>
        </div>
      </IonContent>
      <AppFooter active="home" />
    </>
  );
}

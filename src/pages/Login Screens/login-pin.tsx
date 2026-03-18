import React, { useState } from 'react';
import { IonPage, IonContent, IonText } from '@ionic/react';
import { useHistory } from 'react-router';
import './login.css';

import logo from '../../assets/aadiswan-logo.png';
import userIcon from '../../assets/user-id.svg';
import dialPad from '../../assets/dial-pad.svg';
import fpIcon from '../../assets/fingerprint.svg';

export default function LoginPin() {
  const history = useHistory();
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');

  const push = (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      if (next === '1234') {
        setTimeout(() => history.replace('/dashboard'), 120);
      } else {
        setError('Incorrect PIN');
        setTimeout(() => {
          setError('');
          setPin('');
        }, 700);
      }
    }
  };

  const back = () => pin && setPin(p => p.slice(0, -1));

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

  return (
    <IonPage>
      <IonContent fullscreen className="pin-root-gradient">
        {/* Header / navy gradient */}
        <div className="pin-hero">
          <div className="pin-hero-inner page-wrap">
            <img src={logo} alt="AadiSwan" className="pin-logo" />
            <div className="pin-title">Enter Login PIN</div>

            {/* PIN readout like: 2  4  4  _ */}
            <div className={`pin-readout ${error ? 'shake' : ''}`}>
              {[0, 1, 2, 3].map(i => (
                <span key={i} className={i < pin.length ? 'filled' : ''}>
                  {i < pin.length ? pin[i] : '_'}
                </span>
              ))}
            </div>

            {/* Tabs */}
            <div className="login-tabs tabs-dark">
              <button
                className="tab tab-outline"
                onClick={() => history.replace('/login-creds')}
              >
                <div className="tab-content">
                  <img src={userIcon} alt="" />
                  <span>Credentials</span>
                </div>
              </button>

              <div className="tab-sep" aria-hidden="true" />

              <button
                className="tab tab-solid current"
              >
                <div className="tab-content">
                  <img src={dialPad} alt="" />
                  <span>PIN Login</span>
                </div>
              </button>

              <div className="tab-sep" aria-hidden="true" />

              <button
                className="tab tab-outline"
                onClick={() => history.replace('/login-biometric')}
              >
                <div className="tab-content">
                  <img src={fpIcon} alt="" />
                  <span>Fingerprint Login</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Keypad sheet overlapping header */}
        <div className="pin-sheet">
          <div className="pin-grid">
            {digits.map((k, idx) => {
              if (k === '') return <div key={idx} />; // spacer
              if (k === 'del') {
                return (
                  <button
                    key={idx}
                    className="key del"
                    onClick={back}
                    aria-label="Delete"
                  >
                    ⌫
                  </button>
                );
              }
              return (
                <button key={idx} className="key" onClick={() => push(k)}>
                  {k}
                </button>
              );
            })}
          </div>

          {error && (
            <IonText color="danger">
              <p className="pin-error">{error}</p>
            </IonText>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
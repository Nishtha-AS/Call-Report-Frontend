import React, { useState } from 'react';
import {
  IonPage, IonContent, IonItem, IonInput,
  IonButton, IonText, useIonRouter
} from '@ionic/react';
import './login.css';

import logo from '../../assets/aadiswan-logo.png';
import userIcon from '../../assets/user-id.svg';
import dialPad from '../../assets/dial-pad.svg';
import fpIcon from '../../assets/fingerprint.svg';

export default function LoginCreds() {
  // Keeping useIonRouter for other navigation buttons
  const router = useIonRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const canLogin = (uid: string, pwd: string) => uid === 'test@1' && pwd === '1234';

  const handleLogin = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.preventDefault?.();
    if (!canLogin(userId, password)) {
      setError('Invalid credentials. Try again.');
      return;
    }
    setError('');

    // ✅ This is a direct navigation to the new URL, bypassing Ionic's router.
    // It's a reliable fallback for persistent rendering issues.
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 100);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="creds-root">
        {/* ---------- HERO ---------- */}
        <div className="creds-hero">
          <div className="hero-inner page-wrap">
            <img src={logo} alt="AadiSwan" className="hero-logo" />
            <p className="hero-tagline">
              Transform your <span className="accent">Lending</span> and{' '}
              <span className="accent">Monitoring</span> Process
            </p>
          </div>
        </div>

        {/* ---------- FORM AREA ---------- */}
        <div className="creds-form page-wrap">
          <h2 className="form-title">Welcome!</h2>
          <p className="form-sub">
            Please enter your valid user id and password to proceed
          </p>

          <label className="field-label" htmlFor="userId">User Id:</label>
          <IonItem lines="none" className="field">
            <IonInput
              id="userId"
              value={userId}
              placeholder="user id"
              onIonInput={(e) => setUserId(String(e.detail.value ?? ''))}
              autocapitalize="off"
              autocomplete="username"
              aria-label="User Id"
            />
          </IonItem>

          <label className="field-label" htmlFor="password">Password:</label>
          <IonItem lines="none" className="field">
            <IonInput
              id="password"
              type="password"
              value={password}
              placeholder="Enter Password"
              onIonInput={(e) => setPassword(String(e.detail.value ?? ''))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLogin(e);
              }}
              autocomplete="current-password"
              aria-label="Password"
            />
          </IonItem>

          <button className="link-forgot" type="button">Forgot Password?</button>

          {error && (
            <IonText color="danger">
              <p className="error-msg">{error}</p>
            </IonText>
          )}

          <div className="login-actions">
            <IonButton
              className="btn-login"
              type="button"
              onClick={handleLogin}
            >
              Log In
            </IonButton>
          </div>

          <div className="login-tabs tab-rail page-wrap" role="tablist" aria-label="Login methods">
            <IonButton className="tab tab-solid current" shape="round" role="tab" aria-selected="true">
              <div className="tab-content">
                <img src={userIcon} alt="" />
                <span>Credentials</span>
              </div>
            </IonButton>

            <div className="tab-sep" aria-hidden="true" />

            <IonButton
              className="tab tab-outline"
              shape="round"
              fill="outline"
              role="tab"
              aria-selected="false"
              type="button"
              routerLink="/login-pin"
              routerDirection="forward"
            >
              <div className="tab-content">
                <img src={dialPad} alt="" />
                <span>PIN Login</span>
              </div>
            </IonButton>

            <div className="tab-sep" aria-hidden="true" />

            <IonButton
              className="tab tab-outline"
              shape="round"
              fill="outline"
              role="tab"
              aria-selected="false"
              type="button"
              routerLink="/login-biometric"
              routerDirection="forward"
            >
              <div className="tab-content">
                <img src={fpIcon} alt="" />
                <span>Fingerprint Login</span>
              </div>
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

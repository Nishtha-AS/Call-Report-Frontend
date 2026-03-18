import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router';
import './login.css';

import logo from '../../assets/aadiswan-logo.png';
import credentialsIcon from '../../assets/user-id.svg';
import pinIcon from '../../assets/dial-pad.svg';
import fpIcon from '../../assets/fingerprint.svg';
import fpHero from '../../assets/fingerprint-biometric.png';

export default function LoginBiometric() {
  const history = useHistory();

  const handleBiometric = () => {
    // Simulate successful biometric auth for now
    history.replace('/dashboard');
  };

  return (
    <IonPage>
      <IonContent fullscreen className="bio-root">
        <div className="bio-container page-wrap">
          {/* Logo and tabs at the top */}
          <div className="bio-top">
            <img src={logo} alt="AadiSwan" className="bio-logo" />

            <div className="login-tabs tabs-dark">
              <button className="tab tab-outline" onClick={() => history.replace('/login-creds')}>
                <div className="tab-content">
                  <img src={credentialsIcon} alt="" />
                  <span>Credentials</span>
                </div>
              </button>

              <div className="tab-sep" aria-hidden="true" />

              <button className="tab tab-outline" onClick={() => history.replace('/login-pin')}>
                <div className="tab-content">
                  <img src={pinIcon} alt="" />
                  <span>PIN Login</span>
                </div>
              </button>

              <div className="tab-sep" aria-hidden="true" />

              <button className="tab tab-solid current">
                <div className="tab-content">
                  <img src={fpIcon} alt="" />
                  <span>Fingerprint Login</span>
                </div>
              </button>
            </div>
          </div>

          {/* Biometric trigger button */}
          <button className="bio-touch" onClick={handleBiometric} aria-label="Use fingerprint">
            <img src={fpHero} alt="" className="bio-fingerprint-hero" />
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
}
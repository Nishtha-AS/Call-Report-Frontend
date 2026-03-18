import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import './login.css';
import logo from '../../assets/aadiswan-logo.png';

export default function Splash() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="splash-root">
          <div className="splash-ripples" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="splash-center">
            <img src={logo} alt="AadiSwan" className="splash-logo" />
            <p className="splash-tagline">
              Transform your <span className="accent">Lending</span> and{' '}
              <span className="accent">Monitoring</span> Process
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
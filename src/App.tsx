import React, { useEffect } from 'react';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  useIonRouter, // ✅ use Ionic router for redirects
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Login flow */
import Splash from './pages/Login Screens/splash';
import LoginCreds from './pages/Login Screens/login-creds';
import LoginPin from './pages/Login Screens/login-pin';
import LoginBiometric from './pages/Login Screens/login-biometric';

/* App pages */
import Home from './pages/Home/home';
import Overdue from './pages/Overdue/overdue';
import Future from './pages/Future/future';
import MyCustomers from './pages/My Customer/MyCustomers';

/* Call Report Form */
import CallReportStep1 from './pages/Call Report/CallReportStep1';
import CallReportStep2 from './pages/Call Report/CallReportStep2';
import CallReportStep3 from './pages/Call Report/CallReportStep3';
import CallReportStep4 from './pages/Call Report/CallReportStep4';
import CallReportStep5 from './pages/Call Report/CallReportStep5';
import CallReportStep6 from './pages/Call Report/CallReportStep6';
import CallReportStep7 from './pages/Call Report/CallReportStep7';
import CallReportStep8 from './pages/Call Report/CallReportStep8';
import CallReportSuccess from './pages/Call Report/CallReportSuccess';

/* Call Reports */
import CallReportsList from './pages/Call Reports/CallReportsList';
import ReportsList from './pages/Reports/ReportsList';
import Support from './pages/Support/Support';

setupIonicReact();

/**
 * SplashWithRedirect
 * Use Ionic's router to change the active view so IonRouterOutlet updates immediately.
 */
const SplashWithRedirect: React.FC = () => {
  const router = useIonRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // ✅ Replace splash with login-creds using Ionic view-stack navigation
      router.push('/login-creds', 'root', 'replace');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return <Splash />;
};

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Default redirect */}
          <Route exact path="/">
            <Redirect to="/splash" />
          </Route>

          {/* Auth / Login */}
          <Route exact path="/splash" component={SplashWithRedirect} />
          <Route exact path="/login-creds" component={LoginCreds} />
          <Route exact path="/login-pin" component={LoginPin} />
          <Route exact path="/login-biometric" component={LoginBiometric} />

          {/* Main app */}
          <Route exact path="/dashboard" component={Home} />
          <Route exact path="/overdue" component={Overdue} />
          <Route exact path="/future" component={Future} />
          <Route exact path="/my-customers" component={MyCustomers} />

          {/* Call Report flow */}
          <Route exact path="/call-report/step-1/:ctpt" component={CallReportStep1} />
          <Route exact path="/call-report/step-2/:ctpt" component={CallReportStep2} />
          <Route exact path="/call-report/step-3/:ctpt" component={CallReportStep3} />
          <Route exact path="/call-report/step-4/:ctpt" component={CallReportStep4} />
          <Route exact path="/call-report/step-5/:ctpt" component={CallReportStep5} />
          <Route exact path="/call-report/step-6/:ctpt" component={CallReportStep6} />
          <Route exact path="/call-report/step-7/:ctpt" component={CallReportStep7} />
          <Route exact path="/call-report/step-8/:ctpt" component={CallReportStep8} />
          <Route exact path="/call-report/success/:cr" component={CallReportSuccess} />

          {/* Lists & Support */}
          <Route exact path="/reports" component={ReportsList} />
          <Route exact path="/call-reports" component={CallReportsList} />
          <Route exact path="/support" component={Support} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

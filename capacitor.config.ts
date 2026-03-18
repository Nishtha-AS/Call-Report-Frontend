// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aadiswan.callreport',
  appName: 'Call Report',
  webDir: 'build'   // ✅ CRA/Ionic React build output
};

export default config;
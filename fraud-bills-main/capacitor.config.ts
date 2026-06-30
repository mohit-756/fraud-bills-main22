import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.billguard.app',
  appName: 'BillGuard',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

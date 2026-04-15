import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.demos.enterprise.demos.statemanagement',
  appName: 'State Mgmt',
  webDir: 'www/browser',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;

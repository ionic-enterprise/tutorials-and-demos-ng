import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.demos.enterprise.authconnect.currentui',
  appName: 'Auth UI',
  webDir: 'www/browser',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;

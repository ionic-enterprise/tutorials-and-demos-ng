import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.demos.enterprise.demos.securitytrifecta',
  appName: 'Sec Trifecta',
  webDir: 'www/browser',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;

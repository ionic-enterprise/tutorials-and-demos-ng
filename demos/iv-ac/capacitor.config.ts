import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.demos.enterprise.demos.ivac',
  appName: 'IV + AC',
  webDir: 'www/browser',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;

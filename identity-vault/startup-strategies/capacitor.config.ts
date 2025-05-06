import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.gettingstartediv',
  appName: 'iv-getting-started',
  webDir: 'www/browser',
  android: {
    adjustMarginsForEdgeToEdge: 'auto',
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;

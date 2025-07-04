import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.csdemosecurestorageng',
  appName: 'Secure Storage (Angular)',
  webDir: 'www/browser',
  android: {
    adjustMarginsForEdgeToEdge: 'auto',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;

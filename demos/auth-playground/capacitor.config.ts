import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.authplaygroundng',
  appName: 'Auth Playground NG',
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

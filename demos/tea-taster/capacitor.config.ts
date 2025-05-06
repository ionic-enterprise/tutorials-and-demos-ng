import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kensodemann.teataster',
  appName: 'Tea Taster',
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

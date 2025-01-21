import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kensodemann.teataster',
  appName: 'Tea Taster',
  webDir: 'www/browser',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
  },
};

export default config;

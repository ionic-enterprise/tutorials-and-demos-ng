import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'sqlcipher-kv-pair',
  webDir: 'www',
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

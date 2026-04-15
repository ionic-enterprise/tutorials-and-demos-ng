import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.demos.enterprise.demos.sqlcipherkvpair',
  appName: 'SQLCipher KV',
  webDir: 'www',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
    },
  },
};

export default config;

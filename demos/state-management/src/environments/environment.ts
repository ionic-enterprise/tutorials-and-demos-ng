import { ProviderOptions } from '@ionic-enterprise/auth';

const baseConfig: ProviderOptions = {
  clientId: '64p9c53l5thd5dikra675suvq9',
  discoveryUrl: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_YU8VQe29z/.well-known/openid-configuration',
  scope: 'openid email profile',
  audience: '',
  redirectUri: '',
  logoutUrl: '',
};

export const mobileAuthConfig: ProviderOptions = {
  ...baseConfig,
  redirectUri: 'io.ionic.teataster://auth-action-complete',
  logoutUrl: 'io.ionic.teataster://auth-action-complete',
};

export const webAuthConfig: ProviderOptions = {
  ...baseConfig,
  redirectUri: 'http://localhost:8100/login',
  logoutUrl: 'http://localhost:8100/login',
};

export const environment = {
  production: false,
  dataService: 'https://cs-demo-api.herokuapp.com',
};

import { ProviderOptions } from '@ionic-enterprise/auth';

const baseConfig: ProviderOptions = {
  audience: 'https://io.ionic.demo.ac',
  clientId: 'yLasZNUGkZ19DGEjTmAITBfGXzqbvd00',
  discoveryUrl: 'https://dev-2uspt-sz.us.auth0.com/.well-known/openid-configuration',
  scope: 'openid email picture profile offline_access',
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

import { ProviderOptions } from '@ionic-enterprise/auth';

const baseConfig: ProviderOptions = {
  audience: 'https://io.ionic.demo.ac',
  clientId: 'yLasZNUGkZ19DGEjTmAITBfGXzqbvd00',
  discoveryUrl: 'https://dev-2uspt-sz.us.auth0.com/.well-known/openid-configuration',
  scope: 'openid email picture profile offline_access',
  redirectUri: '',
  logoutUrl: '',
};

const mobileAuthConfig: ProviderOptions = {
  ...baseConfig,
  redirectUri: 'io.ionic.acdemo://auth-action-complete',
  logoutUrl: 'io.ionic.acdemo://auth-action-complete',
};

const webAuthConfig: ProviderOptions = {
  ...baseConfig,
  redirectUri: 'http://localhost:8100/auth-action-complete',
  logoutUrl: 'http://localhost:8100/auth-action-complete',
};

export const environment = {
  production: false,
  dataService: 'https://cs-demo-api.herokuapp.com',
  mobileAuthConfig,
  webAuthConfig,
};

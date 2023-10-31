import { ProviderOptions } from '@ionic-enterprise/auth';

// NOTE: All of our auth providers are configured to use almost identical values for redirectUri and logoutUrl.
//       For mobile, these URIs all use the msauth scheme. This is done to be consistent with the Azure AD
//       requirements. For production applications that are not using Azure, it is recommended to use
//       a scheme that is unique to your application. For example, if your app is named "acprovider",
//       you could use "com.yourcompany.acprovider://auth-action-complete" as your redirectUri and logoutUrl.

const auth0Config: ProviderOptions = {
  // audience value is required for auth0's config. If it doesn't exist, the jwt payload will be empty
  audience: 'https://io.ionic.demo.ac',
  clientId: 'yLasZNUGkZ19DGEjTmAITBfGXzqbvd00',
  discoveryUrl: 'https://dev-2uspt-sz.us.auth0.com/.well-known/openid-configuration',
  redirectUri: 'msauth://auth-action-complete',
  logoutUrl: 'msauth://auth-action-complete',
  scope: 'openid email picture profile',
};

const awsConfig: ProviderOptions = {
  clientId: '64p9c53l5thd5dikra675suvq9',
  discoveryUrl: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_YU8VQe29z/.well-known/openid-configuration',
  scope: 'openid email profile',
  redirectUri: 'msauth://auth-action-complete',
  logoutUrl: 'msauth://auth-action-complete',
  audience: '',
};

const azureConfig: ProviderOptions = {
  clientId: 'ed8cb65d-7bb2-4107-bc36-557fb680b994',
  scope:
    'openid offline_access email profile https://dtjacdemo.onmicrosoft.com/ed8cb65d-7bb2-4107-bc36-557fb680b994/demo.read',
  discoveryUrl:
    'https://dtjacdemo.b2clogin.com/dtjacdemo.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_acdemo2',
  redirectUri: 'msauth://com.ionic.acprovider/O5m5Gtd2Xt8UNkW3wk7DWyKGfv8%3D',
  logoutUrl: 'msauth://com.ionic.acprovider/O5m5Gtd2Xt8UNkW3wk7DWyKGfv8%3D',
  audience: '',
};

const webRedirects = {
  redirectUri: 'http://localhost:8100/auth-action-complete',
  logoutUrl: 'http://localhost:8100/auth-action-complete',
};

export const environment = {
  auth0Config,
  awsConfig,
  azureConfig,
  webRedirects,
  production: false,
  dataService: 'https://cs-demo-api.herokuapp.com',
};

import { OIDCAuthenticationService } from './oidc-authentication.service';

export const createOIDCAuthenticationServiceMock = () =>
  jasmine.createSpyObj<OIDCAuthenticationService>('OIDCAuthenticationService', {
    login: Promise.resolve(),
    logout: Promise.resolve(),
    getAccessToken: Promise.resolve(''),
    isAuthenticated: Promise.resolve(false),
    setAuthProvider: undefined,
  });

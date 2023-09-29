import { AuthenticationService } from './authentication.service';

export const createAuthenticationServiceMock = () =>
  jasmine.createSpyObj<AuthenticationService>('AuthenticationService', {
    isAuthenticated: Promise.resolve(false),
    getAccessToken: Promise.resolve(undefined),
    login: Promise.resolve(),
    logout: Promise.resolve(),
  });

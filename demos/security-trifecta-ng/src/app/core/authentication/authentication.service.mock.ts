import { AuthenticationService } from './authentication.service';

export const createAuthenticationServiceMock = () =>
  jasmine.createSpyObj<AuthenticationService>('AuthenticationService', {
    login: Promise.resolve(),
    logout: Promise.resolve(),
    isAuthenticated: Promise.resolve(false),
    getAccessToken: Promise.resolve(),
    getUserEmail: Promise.resolve(),
  });

import { AuthenticationService } from './authentication.service';

export const createAuthenticationServiceMock = () =>
  jasmine.createSpyObj<AuthenticationService>('AuthenticationService', {
    isAuthenticated: Promise.resolve(false),
    login: Promise.resolve(),
    logout: Promise.resolve(),
  });

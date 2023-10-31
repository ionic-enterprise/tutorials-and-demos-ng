import { AuthenticationExpediterService } from './authentication-expediter.service';

export const createAuthenticationExpediterServiceMock = () =>
  jasmine.createSpyObj<AuthenticationExpediterService>('AuthenticationExpediterService', {
    login: Promise.resolve(),
    logout: Promise.resolve(),
    getAccessToken: Promise.resolve(''),
    isAuthenticated: Promise.resolve(false),
  });

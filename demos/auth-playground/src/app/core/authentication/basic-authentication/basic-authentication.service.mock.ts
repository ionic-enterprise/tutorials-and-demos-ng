import { BasicAuthenticationService } from './basic-authentication.service';

export const createBasicAuthenticationServiceMock = () =>
  jasmine.createSpyObj<BasicAuthenticationService>('BasicAuthenticationService', {
    login: Promise.resolve(),
    logout: Promise.resolve(),
    getAccessToken: Promise.resolve(''),
    isAuthenticated: Promise.resolve(false),
  });

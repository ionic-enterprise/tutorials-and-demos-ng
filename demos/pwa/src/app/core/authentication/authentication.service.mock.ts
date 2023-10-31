export const createAuthenticationServiceMock = () =>
  jasmine.createSpyObj('AuthenticationService', {
    login: Promise.resolve(),
    logout: Promise.resolve(),
    authenticationChange$: undefined,
    getAuthResult: Promise.resolve(),
    isAuthenticated: Promise.resolve(),
    getAccessToken: Promise.resolve(),
    refreshAuth: Promise.resolve(),
  });

import { TestBed } from '@angular/core/testing';
import { AuthConnect, AuthResult } from '@ionic-enterprise/auth';
import { AuthenticationService } from './authentication.service';
import { SessionService } from './session.service';
import { createSessionServiceMock } from './session.service.mock';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    spyOn(AuthConnect, 'login').and.resolveTo(testAuthResult);
    spyOn(AuthConnect, 'logout').and.resolveTo();
    spyOn(AuthConnect, 'setup').and.resolveTo();
    TestBed.overrideProvider(SessionService, { useFactory: createSessionServiceMock });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('performs a setup', async () => {
      await service.initialize();
      expect(AuthConnect.setup).toHaveBeenCalledTimes(1);
    });
  });

  describe('is authenticated', () => {
    it('resolves false if there is no stored auth result', async () => {
      spyOn(AuthConnect, 'isAccessTokenAvailable').and.resolveTo(false);
      const session = TestBed.inject(SessionService);
      (session.getSession as jasmine.Spy).and.resolveTo(null);
      expect(await service.isAuthenticated()).toBe(false);
      expect(AuthConnect.isAccessTokenAvailable).not.toHaveBeenCalled();
    });

    it('resolves false if there is a stored auth result but no access token is available', async () => {
      spyOn(AuthConnect, 'isAccessTokenAvailable').and.resolveTo(false);
      const session = TestBed.inject(SessionService);
      (session.getSession as jasmine.Spy).and.resolveTo(testAuthResult);
      expect(await service.isAuthenticated()).toBe(false);
      expect(AuthConnect.isAccessTokenAvailable).toHaveBeenCalledOnceWith(testAuthResult);
    });

    it('resolves true if there is a stored auth result with an access token', async () => {
      spyOn(AuthConnect, 'isAccessTokenAvailable').and.resolveTo(true);
      const session = TestBed.inject(SessionService);
      (session.getSession as jasmine.Spy).and.resolveTo(testAuthResult);
      expect(await service.isAuthenticated()).toBe(true);
      expect(AuthConnect.isAccessTokenAvailable).toHaveBeenCalledOnceWith(testAuthResult);
    });
  });

  describe('login', () => {
    it('calls the login', async () => {
      await service.login();
      expect(AuthConnect.login).toHaveBeenCalledTimes(1);
    });

    it('saves the result of the login', async () => {
      const session = TestBed.inject(SessionService);
      await service.login();
      expect(session.setSession).toHaveBeenCalledOnceWith(testAuthResult);
    });
  });

  describe('logout', () => {
    describe('when authenticated', () => {
      beforeEach(() => {
        const session = TestBed.inject(SessionService);
        (session.getSession as jasmine.Spy).and.resolveTo(testAuthResult);
      });

      it('calls the logout', async () => {
        await service.logout();
        expect(AuthConnect.logout).toHaveBeenCalledTimes(1);
      });

      it('clears the session', async () => {
        const session = TestBed.inject(SessionService);
        await service.logout();
        expect(session.clear).toHaveBeenCalledTimes(1);
      });
    });

    describe('when not authenticated', () => {
      beforeEach(() => {
        const session = TestBed.inject(SessionService);
        (session.getSession as jasmine.Spy).and.resolveTo(null);
      });

      it('does nothing', async () => {
        const session = TestBed.inject(SessionService);
        await service.logout();
        expect(AuthConnect.logout).not.toHaveBeenCalled();
        expect(session.clear).not.toHaveBeenCalled();
      });
    });
  });
});

const testAuthResult: AuthResult = {
  accessToken: 'the-access-token',
  idToken: 'the-id-token',
  refreshToken: 'the-refresh-token',
  expiresIn: 3600,
  tokenType: 'Bearer',
  scope: 'undefined',
  state: {
    url: 'https://dtjacdemo.b2clogin.com/dtjacdemo.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_acdemo2',
  },
  receivedAt: 1734522164,
  config: {
    platform: 'web',
    logLevel: 'DEBUG',
    ios: {
      webView: 'private',
    },
    web: {
      uiMode: 'popup',
      authFlow: 'implicit',
    },
  },
  provider: {
    config: {
      url: 'https://dtjacdemo.b2clogin.com/dtjacdemo.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_acdemo2',
    },
    manifest: {
      issuer: 'https://dtjacdemo.b2clogin.com/20f8e206-5bfd-4085-9ab0-9e2fca01f2a4/v2.0/',
      authorization_endpoint:
        'https://dtjacdemo.b2clogin.com/dtjacdemo.onmicrosoft.com/oauth2/v2.0/authorize?p=b2c_1_acdemo2',
      token_endpoint: 'https://dtjacdemo.b2clogin.com/dtjacdemo.onmicrosoft.com/oauth2/v2.0/token?p=b2c_1_acdemo2',
      end_session_endpoint:
        'https://dtjacdemo.b2clogin.com/dtjacdemo.onmicrosoft.com/oauth2/v2.0/logout?p=b2c_1_acdemo2',
      jwks_uri: 'https://dtjacdemo.b2clogin.com/dtjacdemo.onmicrosoft.com/discovery/v2.0/keys?p=b2c_1_acdemo2',
      response_modes_supported: ['query', 'fragment', 'form_post'],
      response_types_supported: [
        'code',
        'code id_token',
        'code token',
        'code id_token token',
        'id_token',
        'id_token token',
        'token',
        'token id_token',
      ],
      scopes_supported: ['openid'],
      subject_types_supported: ['pairwise'],
      id_token_signing_alg_values_supported: ['RS256'],
      token_endpoint_auth_methods_supported: ['client_secret_post', 'client_secret_basic'],
      claims_supported: ['idp', 'name', 'sub', 'tfp', 'iss', 'iat', 'exp', 'aud', 'acr', 'nonce', 'auth_time'],
    },
    options: {
      clientId: 'ed8cb65d-7bb2-4107-bc36-557fb680b994',
      scope:
        'openid offline_access email profile https://dtjacdemo.onmicrosoft.com/ed8cb65d-7bb2-4107-bc36-557fb680b994/demo.read',
      discoveryUrl:
        'https://dtjacdemo.b2clogin.com/dtjacdemo.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_acdemo2',
      redirectUri: 'http://localhost:8100/auth-action-complete',
      logoutUrl: 'http://localhost:8100/auth-action-complete',
      audience: '',
    },
    authorizeUrl:
      'https://dtjacdemo.b2clogin.com/dtjacdemo.onmicrosoft.com/oauth2/v2.0/authorize?client_id=ed8cb65d-7bb2-4107-bc36-557fb680b994&redirect_uri=http%3A%2F%2Flocalhost%3A8100%2Fauth-action-complete&scope=openid%20offline_access%20email%20profile%20https%3A%2F%2Fdtjacdemo.onmicrosoft.com%2Fed8cb65d-7bb2-4107-bc36-557fb680b994%2Fdemo.read&nonce=O-t1sg95OeTuPsNhC2NZ&state=eyJ1cmwiOiJodHRwczovL2R0amFjZGVtby5iMmNsb2dpbi5jb20vZHRqYWNkZW1vLm9ubWljcm9zb2Z0LmNvbS9vYXV0aDIvdjIuMC90b2tlbj9wPWIyY18xX2FjZGVtbzIifQ&response_type=id_token%20token&response_mode=fragment&p=b2c_1_acdemo2',
  },
  rawResult:
    '#state=eyJ1cmwiOiJodHRwczovL2R0amFjZGVtby5iMmNsb2dpbi5jb20vZHRqYWNkZW1vLm9ubWljcm9zb2Z0LmNvbS9vYXV0aDIvdjIuMC90b2tlbj9wPWIyY18xX2FjZGVtbzIifQ&access_token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJlZDhjYjY1ZC03YmIyLTQxMDctYmMzNi01NTdmYjY4MGI5OTQiLCJpc3MiOiJodHRwczovL2R0amFjZGVtby5iMmNsb2dpbi5jb20vMjBmOGUyMDYtNWJmZC00MDg1LTlhYjAtOWUyZmNhMDFmMmE0L3YyLjAvIiwiZXhwIjoxNzM0NTI1NzYzLCJuYmYiOjE3MzQ1MjIxNjMsInN1YiI6ImYwZmM5MGQ1LWU0ODEtNDY5Ni1hMGQ3LThmZDI5NjIzNmRmNiIsIm5hbWUiOiJUZXN0IFVzZXIiLCJ0ZnAiOiJCMkNfMV9hY2RlbW8yIiwibm9uY2UiOiJPLXQxc2c5NU9lVHVQc05oQzJOWiIsInNjcCI6ImRlbW8ucmVhZCIsImF6cCI6ImVkOGNiNjVkLTdiYjItNDEwNy1iYzM2LTU1N2ZiNjgwYjk5NCIsInZlciI6IjEuMCIsImlhdCI6MTczNDUyMjE2M30.QyHw7d_6TTNNVu7_ceMpmAH1SbsD609DNCxAQQuQNaz_wr9JyeXxn0Dykxm-QoIejl7DIkXG6XQsoVCfsm2sC0JINts-lqFPCgdS-afMkc3yNccJlbyYYb_iBXmhRfpfx2329R-4qAElwQgaQwSZqfBGhOtSTF8iwl6YZla51IFnPmMPopEUeb30NywI6QLYThGkmHYbrh_BCezY98BOLS66XssUgjcXi7qHAEJJlaDzxtA77BdoTPcNhJwdTTfgi9J433auMertmALhYtq2vvLVgZb3ypxQmYl_--XcZPavKwDFpz7tlA5TtP1I7SKaJkec7uOb8dolptMyyVtSQg&token_type=Bearer&expires_in=3600&id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJleHAiOjE3MzQ1MjU3NjMsIm5iZiI6MTczNDUyMjE2MywidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9kdGphY2RlbW8uYjJjbG9naW4uY29tLzIwZjhlMjA2LTViZmQtNDA4NS05YWIwLTllMmZjYTAxZjJhNC92Mi4wLyIsInN1YiI6ImYwZmM5MGQ1LWU0ODEtNDY5Ni1hMGQ3LThmZDI5NjIzNmRmNiIsImF1ZCI6ImVkOGNiNjVkLTdiYjItNDEwNy1iYzM2LTU1N2ZiNjgwYjk5NCIsIm5vbmNlIjoiTy10MXNnOTVPZVR1UHNOaEMyTloiLCJpYXQiOjE3MzQ1MjIxNjMsImF1dGhfdGltZSI6MTczNDUyMjE2MywibmFtZSI6IlRlc3QgVXNlciIsInRmcCI6IkIyQ18xX2FjZGVtbzIiLCJhdF9oYXNoIjoiYkhfN2NTVERUYmJ3d0FvV3ZGcTJRUSJ9.S8aHbgTfjQ3tWajg2pDeEZnacvycTCnmqbFGv7cgIhA507L333NP6Eq8baHfGOx5AE2nA3S9LO1HSvmVAxq8S0g8ioevIYNovpXJZ1YEdBq1z_xXCxHFAhw0IxDh3xwudkD2frLygSUj8b_v2Rf-MM0zRcgAtS74qH3sCcvO0eZudZjTFNu7T2XecDQWND11MdPQAd3S7r3pyQdLp4SF2g30vdW8Of9BDOKuHYe4Y3ctJHvFWtBEQOSYW8_9AAJ01xNfkgZ71qQACh_yb9qoV1Na4ynNL7VEBUMAk6bG1iPTM5-_SZ1ZcaeSwWRi0P0sSFCWUqNnSZLq1H0_MOZkaA',
};

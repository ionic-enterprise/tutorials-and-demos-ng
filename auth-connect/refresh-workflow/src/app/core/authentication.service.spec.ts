import { TestBed } from '@angular/core/testing';
import { Auth0Provider, AuthConnect } from '@ionic-enterprise/auth';
import { AuthenticationService } from './authentication.service';
import { SessionService } from './session.service';
import { createSessionServiceMock } from './session.service.mock';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  const refreshAuthResult: any = {
    accessToken: 'refreshed-access-token',
    refreshToken: 'refreshed-refresh-token',
    idToken: 'refreshed-id-token',
  };

  const testAuthResult: any = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    idToken: 'test-id-token',
  };

  beforeEach(() => {
    spyOn(AuthConnect, 'isAccessTokenExpired').and.resolveTo(false);
    spyOn(AuthConnect, 'isRefreshTokenAvailable').and.resolveTo(false);
    spyOn(AuthConnect, 'login').and.resolveTo(testAuthResult);
    spyOn(AuthConnect, 'logout').and.resolveTo();
    spyOn(AuthConnect, 'refreshSession').and.resolveTo(undefined);
    spyOn(AuthConnect, 'setup').and.resolveTo();
    TestBed.configureTestingModule({}).overrideProvider(SessionService, { useFactory: createSessionServiceMock });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('performs a setup', () => {
    expect(AuthConnect.setup).toHaveBeenCalledTimes(1);
  });

  describe('is authenticated', () => {
    describe('when there is no stored auth result', () => {
      beforeEach(() => {
        const session = TestBed.inject(SessionService);
        (session.getSession as jasmine.Spy).and.resolveTo(null);
      });

      it('resolves false', async () => {
        expect(await service.isAuthenticated()).toBe(false);
      });

      it('does not check for an expired access token', async () => {
        await service.isAuthenticated();
        expect(AuthConnect.isAccessTokenExpired).not.toHaveBeenCalled();
      });
    });

    describe('when there is a stored auth result', () => {
      beforeEach(() => {
        const session = TestBed.inject(SessionService);
        (session.getSession as jasmine.Spy).and.resolveTo(testAuthResult);
      });

      it('checks for an expired access token', async () => {
        await service.isAuthenticated();
        expect(AuthConnect.isAccessTokenExpired).toHaveBeenCalledOnceWith(testAuthResult);
      });

      describe('if the token is not expired', () => {
        beforeEach(() => {
          (AuthConnect.isAccessTokenExpired as jasmine.Spy).and.resolveTo(false);
        });

        it('resolves true', async () => {
          expect(await service.isAuthenticated()).toBe(true);
        });
      });

      describe('if the token is expired', () => {
        beforeEach(() => {
          (AuthConnect.isAccessTokenExpired as jasmine.Spy).and.resolveTo(true);
        });

        describe('if a refresh token is available', () => {
          beforeEach(() => {
            (AuthConnect.isRefreshTokenAvailable as jasmine.Spy).and.resolveTo(true);
          });

          it('attempts a refresh', async () => {
            await service.isAuthenticated();
            expect(AuthConnect.refreshSession).toHaveBeenCalledOnceWith(jasmine.any(Auth0Provider), testAuthResult);
          });

          describe('if the refresh is successful', () => {
            beforeEach(() => {
              (AuthConnect.refreshSession as jasmine.Spy).and.resolveTo(refreshAuthResult);
            });

            it('resolves true', async () => {
              expect(await service.isAuthenticated()).toBe(true);
            });
          });

          describe('if the refresh fails', () => {
            beforeEach(() => {
              (AuthConnect.refreshSession as jasmine.Spy).and.rejectWith(new Error('test error'));
            });

            it('resolves false', async () => {
              expect(await service.isAuthenticated()).toBe(false);
            });
          });
        });

        describe('if a refresh token is not available', () => {
          beforeEach(() => {
            (AuthConnect.isRefreshTokenAvailable as jasmine.Spy).and.resolveTo(false);
          });

          it('does not attempt a refresh', async () => {
            await service.isAuthenticated();
            expect(AuthConnect.refreshSession).not.toHaveBeenCalled();
          });

          it('resolves false', async () => {
            expect(await service.isAuthenticated()).toBe(false);
          });
        });
      });
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

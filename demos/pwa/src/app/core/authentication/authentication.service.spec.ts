import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { AuthConnect, CognitoProvider } from '@ionic-enterprise/auth';
import { SessionVaultService } from '../session-vault/session-vault.service';
import { ModalController } from '@ionic/angular';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { createSessionVaultServiceMock } from '../testing';

describe('AuthenticationService', () => {
  let modal: HTMLIonModalElement;
  const refreshedAuthResult: any = {
    accessToken: 'refreshed-access-token',
    refreshToken: 'refreshed-refresh-token',
    idToken: 'refreshed-id-token',
  };

  const testAuthResult: any = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    idToken: 'test-id-token',
  };

  let authService: AuthenticationService;
  let sessionVault: SessionVaultService;

  beforeEach(() => {
    spyOn(AuthConnect, 'login').and.returnValue(Promise.resolve(testAuthResult));
    spyOn(AuthConnect, 'logout').and.callFake(() => Promise.resolve());
    spyOn(AuthConnect, 'setup').and.returnValue(Promise.resolve());
    spyOn(AuthConnect, 'buildAuthResult').and.callFake(() => Promise.resolve({ name: 'generatedAuthResult' } as any));
    modal = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModalController,
          useValue: createOverlayControllerMock('ModalController', modal),
        },
        { provide: SessionVaultService, useValue: createSessionVaultServiceMock() },
      ],
    });
    authService = TestBed.inject(AuthenticationService);
    sessionVault = TestBed.inject(SessionVaultService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('initializes once', async () => {
    await authService.isAuthenticated();
    await authService.login();
    await authService.isAuthenticated();
    await authService.logout();

    expect(AuthConnect.setup).toHaveBeenCalledTimes(1);
    expect(AuthConnect.setup).toHaveBeenCalledWith({
      platform: 'web',
      logLevel: 'DEBUG',
      ios: {
        webView: 'private',
      },
      web: {
        uiMode: 'popup',
        authFlow: 'implicit',
      },
    });
  });

  describe('is authenticated', () => {
    describe('if there is no auth result', () => {
      beforeEach(() => {
        (sessionVault.getSession as jasmine.Spy).and.returnValue(undefined);
        spyOn(AuthConnect, 'isAccessTokenExpired').and.returnValue(Promise.resolve(false));
      });

      it('does not check for an expired access token', async () => {
        await authService.isAuthenticated();
        expect(AuthConnect.isAccessTokenExpired).not.toHaveBeenCalled();
      });

      it('resolves false ', async () => {
        expect(await authService.isAuthenticated()).toBe(false);
      });
    });

    describe('if there is an auth result', () => {
      beforeEach(() => {
        (sessionVault.getSession as jasmine.Spy).and.returnValue(testAuthResult);
      });

      describe('if the access token is not expired', () => {
        beforeEach(() => {
          spyOn(AuthConnect, 'isAccessTokenExpired').and.returnValue(Promise.resolve(false));
        });

        it('resolves true', async () => {
          expect(await authService.isAuthenticated()).toBe(true);
        });
      });

      describe('if the access token is expired', () => {
        beforeEach(() => {
          spyOn(AuthConnect, 'isAccessTokenExpired').and.returnValue(Promise.resolve(true));
        });

        describe('if a refresh token exists', () => {
          beforeEach(() => {
            spyOn(AuthConnect, 'isRefreshTokenAvailable').and.returnValue(Promise.resolve(true));
          });

          it('attempts a refresh', async () => {
            spyOn(AuthConnect, 'refreshSession').and.returnValue(Promise.resolve(refreshedAuthResult));
            await authService.isAuthenticated();
            expect(AuthConnect.refreshSession).toHaveBeenCalledTimes(1);
            expect(AuthConnect.refreshSession).toHaveBeenCalledWith(jasmine.any(CognitoProvider), testAuthResult);
          });

          describe('when the refresh is successful', () => {
            beforeEach(() => {
              spyOn(AuthConnect, 'refreshSession').and.returnValue(Promise.resolve(refreshedAuthResult));
            });

            it('saves the new auth result', async () => {
              await authService.isAuthenticated();
              expect(sessionVault.setSession).toHaveBeenCalledTimes(1);
              expect(sessionVault.setSession).toHaveBeenCalledWith(refreshedAuthResult);
            });

            it('resolves true', async () => {
              expect(await authService.isAuthenticated()).toBe(true);
            });
          });

          describe('when the refresh fails', () => {
            beforeEach(() => {
              spyOn(AuthConnect, 'refreshSession').and.rejectWith(new Error('refresh failed'));
            });

            it('clears the vault', async () => {
              await authService.isAuthenticated();
              expect(sessionVault.clear).toHaveBeenCalledTimes(2);
            });

            it('resolves false', async () => {
              expect(await authService.isAuthenticated()).toBe(false);
            });
          });
        });

        describe('if a refresh token does not exist', () => {
          beforeEach(() => {
            spyOn(AuthConnect, 'refreshSession');
            spyOn(AuthConnect, 'isRefreshTokenAvailable').and.returnValue(Promise.resolve(false));
          });

          it('it does not attempt a refresh', async () => {
            await authService.isAuthenticated();
            expect(AuthConnect.refreshSession).not.toHaveBeenCalled();
          });

          it('clears the vault', async () => {
            await authService.isAuthenticated();
            expect(sessionVault.clear).toHaveBeenCalledTimes(1);
          });

          it('resolves false', async () => {
            expect(await authService.isAuthenticated()).toBe(false);
          });
        });
      });
    });
  });

  describe('get access token', () => {
    describe('if there is no auth result', () => {
      beforeEach(() => {
        (sessionVault.getSession as jasmine.Spy).and.returnValue(undefined);
        spyOn(AuthConnect, 'isAccessTokenExpired').and.returnValue(Promise.resolve(false));
      });

      it('does not check for an expired access token', async () => {
        await authService.getAccessToken();
        expect(AuthConnect.isAccessTokenExpired).not.toHaveBeenCalled();
      });

      it('resolves undefined ', async () => {
        expect(await authService.getAccessToken()).toBeUndefined();
      });
    });

    describe('if there is an auth result', () => {
      beforeEach(() => {
        (sessionVault.getSession as jasmine.Spy).and.returnValue(testAuthResult);
      });

      describe('if the access token is not expired', () => {
        beforeEach(() => {
          spyOn(AuthConnect, 'isAccessTokenExpired').and.returnValue(Promise.resolve(false));
        });

        it('resolves the access token', async () => {
          expect(await authService.getAccessToken()).toBe(testAuthResult.accessToken);
        });
      });

      describe('if the access token is expired', () => {
        beforeEach(() => {
          spyOn(AuthConnect, 'isAccessTokenExpired').and.returnValue(Promise.resolve(true));
        });

        describe('if a refresh token exists', () => {
          beforeEach(() => {
            spyOn(AuthConnect, 'isRefreshTokenAvailable').and.returnValue(Promise.resolve(true));
          });

          it('attempts a refresh', async () => {
            spyOn(AuthConnect, 'refreshSession').and.returnValue(Promise.resolve(refreshedAuthResult));
            await authService.getAccessToken();
            expect(AuthConnect.refreshSession).toHaveBeenCalledTimes(1);
            expect(AuthConnect.refreshSession).toHaveBeenCalledWith(jasmine.any(CognitoProvider), testAuthResult);
          });

          describe('when the refresh is successful', () => {
            beforeEach(() => {
              spyOn(AuthConnect, 'refreshSession').and.returnValue(Promise.resolve(refreshedAuthResult));
            });

            it('saves the new auth result', async () => {
              await authService.getAccessToken();
              expect(sessionVault.setSession).toHaveBeenCalledTimes(1);
              expect(sessionVault.setSession).toHaveBeenCalledWith(refreshedAuthResult);
            });

            it('resolves the new token', async () => {
              expect(await authService.getAccessToken()).toEqual(refreshedAuthResult.accessToken);
            });
          });

          describe('when the refresh fails', () => {
            beforeEach(() => {
              spyOn(AuthConnect, 'refreshSession').and.rejectWith(new Error('refresh failed'));
            });

            it('clears the vault', async () => {
              await authService.getAccessToken();
              expect(sessionVault.clear).toHaveBeenCalledTimes(2);
            });

            it('resolves undefined', async () => {
              expect(await authService.getAccessToken()).toBeUndefined();
            });
          });
        });

        describe('if a refresh token does not exist', () => {
          beforeEach(() => {
            spyOn(AuthConnect, 'refreshSession');
            spyOn(AuthConnect, 'isRefreshTokenAvailable').and.returnValue(Promise.resolve(false));
          });

          it('it does not attempt a refresh', async () => {
            await authService.getAccessToken();
            expect(AuthConnect.refreshSession).not.toHaveBeenCalled();
          });

          it('clears the vault', async () => {
            await authService.getAccessToken();
            expect(sessionVault.clear).toHaveBeenCalledTimes(1);
          });

          it('resolves undefined', async () => {
            expect(await authService.getAccessToken()).toBeUndefined();
          });
        });
      });
    });
  });

  describe('login', () => {
    it('performs a login', async () => {
      await authService.login();
      expect(AuthConnect.login).toHaveBeenCalledTimes(1);
      expect(AuthConnect.login).toHaveBeenCalledWith(jasmine.any(CognitoProvider), {
        clientId: '64p9c53l5thd5dikra675suvq9',
        discoveryUrl:
          'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_YU8VQe29z/.well-known/openid-configuration',
        redirectUri: 'http://localhost:8100/auth-action-complete',
        logoutUrl: 'http://localhost:8100/auth-action-complete',
        scope: 'openid email profile',
        audience: '',
      });
    });

    it('sets the auth result value', async () => {
      (AuthConnect.login as jasmine.Spy).and.returnValue(testAuthResult);
      await authService.login();
      expect(sessionVault.setSession).toHaveBeenCalledTimes(1);
      expect(sessionVault.setSession).toHaveBeenCalledWith(testAuthResult);
    });
  });

  describe('logout', () => {
    it('gets the current auth result', async () => {
      (sessionVault.getSession as jasmine.Spy).and.returnValue(testAuthResult);
      spyOn(AuthConnect, 'isAccessTokenExpired').and.returnValue(Promise.resolve(false));

      await authService.logout();
      expect(sessionVault.getSession).toHaveBeenCalledTimes(1);
    });

    describe('if there is no auth result', () => {
      beforeEach(() => {
        (sessionVault.getSession as jasmine.Spy).and.returnValue(undefined);
      });

      it('builds an auth result', async () => {
        await authService.logout();
        expect(AuthConnect.buildAuthResult).toHaveBeenCalledTimes(1);
        expect(AuthConnect.buildAuthResult).toHaveBeenCalledWith(jasmine.any(CognitoProvider), jasmine.any(Object), {});
      });

      it('calls logout ', async () => {
        await authService.logout();
        expect(AuthConnect.logout).toHaveBeenCalledTimes(1);
        expect(AuthConnect.logout).toHaveBeenCalledWith(jasmine.any(CognitoProvider), {
          name: 'generatedAuthResult',
        } as any);
      });
    });

    describe('if there is an auth result', () => {
      beforeEach(() => {
        (sessionVault.getSession as jasmine.Spy).and.returnValue(testAuthResult);
        spyOn(AuthConnect, 'isAccessTokenExpired').and.returnValue(Promise.resolve(false));
      });

      it('does not builds a auth result', async () => {
        await authService.logout();
        expect(AuthConnect.buildAuthResult).not.toHaveBeenCalled();
      });

      it('calls logout ', async () => {
        await authService.logout();
        expect(AuthConnect.logout).toHaveBeenCalledTimes(1);
        expect(AuthConnect.logout).toHaveBeenCalledWith(jasmine.any(CognitoProvider), testAuthResult);
      });

      it('clears the auth result', async () => {
        await authService.logout();
        expect(sessionVault.clear).toHaveBeenCalledTimes(1);
      });
    });
  });
});

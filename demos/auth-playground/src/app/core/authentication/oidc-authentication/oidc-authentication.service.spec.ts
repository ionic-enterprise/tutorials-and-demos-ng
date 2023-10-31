import { TestBed } from '@angular/core/testing';
import { SessionVaultService } from '@app/core/session-vault/session-vault.service';
import { createSessionVaultServiceMock } from '@app/core/testing';
import { AuthVendor } from '@app/models';
import { environment } from '@env/environment';
import {
  Auth0Provider,
  AuthConnect,
  AuthResult,
  AzureProvider,
  CognitoProvider,
  ProviderOptions,
} from '@ionic-enterprise/auth';
import { Platform } from '@ionic/angular';
import { createPlatformMock } from '@test/mocks';
import { OIDCAuthenticationService } from './oidc-authentication.service';

const refreshedAuthResult = {
  accessToken: 'refreshed-access-token',
  refreshToken: 'refreshed-refresh-token',
  idToken: 'refreshed-id-token',
};

const testAuthResult = {
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
  idToken: 'test-id-token',
};

const builtAuthResult = {
  accessToken: 'built-access-token',
  refreshToken: 'built-refresh-token',
  idToken: 'built-id-token',
};

[true, false].forEach((isNative: boolean) => {
  describe(`OIDC Authentication Service on ${isNative ? 'native' : 'web'}`, () => {
    let service: OIDCAuthenticationService;

    beforeEach(() => {
      spyOn(AuthConnect, 'setup').and.callFake(() => Promise.resolve());
      const platform = createPlatformMock();
      (platform.is as jasmine.Spy).and.returnValue(isNative);
      TestBed.configureTestingModule({
        providers: [
          { provide: Platform, useValue: platform },
          { provide: SessionVaultService, useFactory: createSessionVaultServiceMock },
        ],
      });
      service = TestBed.inject(OIDCAuthenticationService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('initializes', () => {
      expect(AuthConnect.setup).toHaveBeenCalledTimes(1);
      expect(AuthConnect.setup).toHaveBeenCalledWith({
        platform: isNative ? 'capacitor' : 'web',
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

    ['Auth0', 'Azure', 'AWS'].forEach((vendor: AuthVendor) => {
      describe(vendor, () => {
        let expectedProviderType: typeof Auth0Provider | typeof AzureProvider | typeof CognitoProvider;
        let expectedOptions: ProviderOptions;
        beforeEach(() => {
          service.setAuthProvider(vendor);
          if (vendor === 'Auth0') {
            expectedOptions = { ...environment.auth0Config, ...(isNative ? {} : environment.webRedirects) };
            expectedProviderType = Auth0Provider;
          } else if (vendor === 'AWS') {
            expectedOptions = { ...environment.awsConfig, ...(isNative ? {} : environment.webRedirects) };
            expectedProviderType = CognitoProvider;
          } else {
            expectedOptions = { ...environment.azureConfig, ...(isNative ? {} : environment.webRedirects) };
            expectedProviderType = AzureProvider;
          }
        });

        describe('login', () => {
          beforeEach(() => {
            spyOn(AuthConnect, 'login').and.callFake(() => Promise.resolve(testAuthResult as AuthResult));
          });

          it('calls the auth connect login', async () => {
            await service.login();
            expect(AuthConnect.login).toHaveBeenCalledTimes(1);
            expect(AuthConnect.login).toHaveBeenCalledWith(jasmine.any(expectedProviderType), expectedOptions);
          });

          it('saves the auth result', async () => {
            const sessionVault = TestBed.inject(SessionVaultService);
            await service.login();
            expect(sessionVault.setValue).toHaveBeenCalledTimes(1);
            expect(sessionVault.setValue).toHaveBeenCalledWith('auth-result', testAuthResult);
          });
        });

        describe('is authenticated', () => {
          beforeEach(() => {
            spyOn(AuthConnect, 'isAccessTokenExpired').and.callFake(() => Promise.resolve(false));
            spyOn(AuthConnect, 'isRefreshTokenAvailable').and.callFake(() => Promise.resolve(false));
            spyOn(AuthConnect, 'refreshSession').and.callFake(() => Promise.resolve(refreshedAuthResult as AuthResult));
          });
          describe('if there is no auth result', () => {
            beforeEach(() => {
              const sessionVault = TestBed.inject(SessionVaultService);
              (sessionVault.getValue as jasmine.Spy).and.resolveTo(undefined);
            });

            it('does not check for an expired access token', async () => {
              await service.isAuthenticated();
              expect(AuthConnect.isAccessTokenExpired).not.toHaveBeenCalled();
            });

            it('resolves false ', async () => {
              expect(await service.isAuthenticated()).toBe(false);
            });
          });

          describe('if there is an auth result', () => {
            beforeEach(() => {
              const sessionVault = TestBed.inject(SessionVaultService);
              (sessionVault.getValue as jasmine.Spy).and.resolveTo(testAuthResult);
            });

            describe('if the access token is not expired', () => {
              beforeEach(() => {
                (AuthConnect.isAccessTokenExpired as jasmine.Spy).and.resolveTo(false);
              });

              it('resolves true', async () => {
                expect(await service.isAuthenticated()).toBe(true);
              });
            });

            describe('if the access token is expired', () => {
              beforeEach(() => {
                (AuthConnect.isAccessTokenExpired as jasmine.Spy).and.resolveTo(true);
              });

              describe('if a refresh token exists', () => {
                beforeEach(() => {
                  (AuthConnect.isRefreshTokenAvailable as jasmine.Spy).and.resolveTo(true);
                });

                it('attempts a refresh', async () => {
                  await service.isAuthenticated();
                  expect(AuthConnect.refreshSession).toHaveBeenCalledTimes(1);
                  expect(AuthConnect.refreshSession).toHaveBeenCalledWith(
                    jasmine.any(expectedProviderType),
                    testAuthResult as AuthResult,
                  );
                });

                describe('when the refresh is successful', () => {
                  beforeEach(() => {
                    (AuthConnect.refreshSession as jasmine.Spy).and.resolveTo(refreshedAuthResult);
                  });

                  it('saves the new auth result', async () => {
                    const sessionVault = TestBed.inject(SessionVaultService);
                    await service.isAuthenticated();
                    expect(sessionVault.setValue).toHaveBeenCalledTimes(1);
                    expect(sessionVault.setValue).toHaveBeenCalledWith('auth-result', refreshedAuthResult);
                  });

                  it('resolves true', async () => {
                    expect(await service.isAuthenticated()).toBe(true);
                  });
                });

                describe('when the refresh fails', () => {
                  beforeEach(() => {
                    (AuthConnect.refreshSession as jasmine.Spy).and.rejectWith(new Error('refresh failed'));
                  });

                  it('clears the vault', async () => {
                    const sessionVault = TestBed.inject(SessionVaultService);
                    await service.isAuthenticated();
                    expect(sessionVault.clear).toHaveBeenCalledTimes(1);
                  });

                  it('resolves false', async () => {
                    expect(await service.isAuthenticated()).toBe(false);
                  });
                });
              });

              describe('if a refresh token does not exist', () => {
                beforeEach(() => {
                  (AuthConnect.isRefreshTokenAvailable as jasmine.Spy).and.resolveTo(false);
                });

                it('it does not attempt a refresh', async () => {
                  await service.isAuthenticated();
                  expect(AuthConnect.refreshSession).not.toHaveBeenCalled();
                });

                it('clears the vault', async () => {
                  const sessionVault = TestBed.inject(SessionVaultService);
                  await service.isAuthenticated();
                  expect(sessionVault.clear).toHaveBeenCalledTimes(1);
                });

                it('resolves false', async () => {
                  expect(await service.isAuthenticated()).toBe(false);
                });
              });
            });
          });
        });

        describe('get access token', () => {
          beforeEach(() => {
            spyOn(AuthConnect, 'isAccessTokenExpired').and.callFake(() => Promise.resolve(false));
            spyOn(AuthConnect, 'refreshSession').and.callFake(() => Promise.resolve(refreshedAuthResult as AuthResult));
            spyOn(AuthConnect, 'isRefreshTokenAvailable').and.callFake(() => Promise.resolve(true));
          });

          describe('if there is no auth result', () => {
            beforeEach(() => {
              const sessionVault = TestBed.inject(SessionVaultService);
              (sessionVault.getValue as jasmine.Spy).and.resolveTo(undefined);
            });

            it('does not check for an expired access token', async () => {
              await service.getAccessToken();
              expect(AuthConnect.isAccessTokenExpired).not.toHaveBeenCalled();
            });

            it('resolves undefined ', async () => {
              expect(await service.getAccessToken()).toBeUndefined();
            });
          });

          describe('if there is an auth result', () => {
            beforeEach(() => {
              const sessionVault = TestBed.inject(SessionVaultService);
              (sessionVault.getValue as jasmine.Spy).and.resolveTo(testAuthResult);
            });

            describe('if the access token is not expired', () => {
              beforeEach(() => {
                (AuthConnect.isAccessTokenExpired as jasmine.Spy).and.resolveTo(false);
              });

              it('resolves the access token', async () => {
                expect(await service.getAccessToken()).toBe(testAuthResult.accessToken);
              });
            });

            describe('if the access token is expired', () => {
              beforeEach(() => {
                (AuthConnect.isAccessTokenExpired as jasmine.Spy).and.resolveTo(true);
              });

              describe('if a refresh token exists', () => {
                beforeEach(() => {
                  (AuthConnect.isRefreshTokenAvailable as jasmine.Spy).and.resolveTo(true);
                });

                it('attempts a refresh', async () => {
                  await service.getAccessToken();
                  expect(AuthConnect.refreshSession).toHaveBeenCalledTimes(1);
                  expect(AuthConnect.refreshSession).toHaveBeenCalledWith(
                    jasmine.any(expectedProviderType),
                    testAuthResult as AuthResult,
                  );
                });

                describe('when the refresh is successful', () => {
                  beforeEach(() => {
                    (AuthConnect.refreshSession as jasmine.Spy).and.resolveTo(refreshedAuthResult as AuthResult);
                  });

                  it('saves the new auth result', async () => {
                    const sessionVault = TestBed.inject(SessionVaultService);
                    await service.getAccessToken();
                    expect(sessionVault.setValue).toHaveBeenCalledTimes(1);
                    expect(sessionVault.setValue).toHaveBeenCalledWith('auth-result', refreshedAuthResult);
                  });

                  it('resolves the new token', async () => {
                    expect(await service.getAccessToken()).toEqual(refreshedAuthResult.accessToken);
                  });
                });

                describe('when the refresh fails', () => {
                  beforeEach(() => {
                    (AuthConnect.refreshSession as jasmine.Spy).and.rejectWith(new Error('refresh failed'));
                  });

                  it('clears the vault', async () => {
                    const sessionVault = TestBed.inject(SessionVaultService);
                    await service.getAccessToken();
                    expect(sessionVault.clear).toHaveBeenCalledTimes(1);
                  });

                  it('resolves undefined', async () => {
                    expect(await service.getAccessToken()).toBeUndefined();
                  });
                });
              });

              describe('if a refresh token does not exist', () => {
                beforeEach(() => {
                  (AuthConnect.isRefreshTokenAvailable as jasmine.Spy).and.resolveTo(false);
                });

                it('it does not attempt a refresh', async () => {
                  await service.getAccessToken();
                  expect(AuthConnect.refreshSession).not.toHaveBeenCalled();
                });

                it('clears the vault', async () => {
                  const sessionVault = TestBed.inject(SessionVaultService);
                  await service.getAccessToken();
                  expect(sessionVault.clear).toHaveBeenCalledTimes(1);
                });

                it('resolves undefined', async () => {
                  expect(await service.getAccessToken()).toBeUndefined();
                });
              });
            });
          });
        });

        describe('logout', () => {
          beforeEach(() => {
            spyOn(AuthConnect, 'logout').and.callFake(() => Promise.resolve());
            spyOn(AuthConnect, 'buildAuthResult').and.callFake(() => Promise.resolve(builtAuthResult as AuthResult));
            spyOn(AuthConnect, 'isAccessTokenExpired').and.callFake(() => Promise.resolve(false));
            spyOn(AuthConnect, 'isRefreshTokenAvailable').and.callFake(() => Promise.resolve(true));
          });

          it('gets the current auth result', async () => {
            const sessionVault = TestBed.inject(SessionVaultService);
            await service.logout();
            expect(sessionVault.getValue).toHaveBeenCalledTimes(1);
            expect(sessionVault.getValue).toHaveBeenCalledWith('auth-result');
          });

          describe('if there is no auth result', () => {
            beforeEach(() => {
              const sessionVault = TestBed.inject(SessionVaultService);
              (sessionVault.getValue as jasmine.Spy).and.resolveTo(undefined);
            });

            it('builds an auth result', async () => {
              await service.logout();
              expect(AuthConnect.buildAuthResult).toHaveBeenCalledOnceWith(
                jasmine.any(expectedProviderType),
                expectedOptions,
                {},
              );
            });

            it('calls logout with the built auth result', async () => {
              await service.logout();
              expect(AuthConnect.logout).toHaveBeenCalledTimes(1);
              expect(AuthConnect.logout).toHaveBeenCalledWith(
                jasmine.any(expectedProviderType),
                builtAuthResult as AuthResult,
              );
            });

            it('clears the auth result', async () => {
              const sessionVault = TestBed.inject(SessionVaultService);
              await service.logout();
              expect(sessionVault.clear).toHaveBeenCalledTimes(1);
            });
          });

          describe('if there is an auth result', () => {
            beforeEach(() => {
              const sessionVault = TestBed.inject(SessionVaultService);
              (AuthConnect.isAccessTokenExpired as jasmine.Spy).and.resolveTo(false);
              (sessionVault.getValue as jasmine.Spy).and.resolveTo(testAuthResult as AuthResult);
            });

            it('calls logout ', async () => {
              await service.logout();
              expect(AuthConnect.logout).toHaveBeenCalledTimes(1);
              expect(AuthConnect.logout).toHaveBeenCalledWith(
                jasmine.any(expectedProviderType),
                testAuthResult as AuthResult,
              );
            });

            it('clears the auth result', async () => {
              const sessionVault = TestBed.inject(SessionVaultService);
              await service.logout();
              expect(sessionVault.clear).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
    });
  });
});

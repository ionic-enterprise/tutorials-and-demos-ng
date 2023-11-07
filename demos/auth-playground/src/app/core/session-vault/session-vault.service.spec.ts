import { TestBed } from '@angular/core/testing';
import { PinDialogComponent } from '@app/pin-dialog/pin-dialog.component';
import {
  BiometricPermissionState,
  Device,
  DeviceSecurityType,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';
import { ModalController, Platform } from '@ionic/angular';
import { createOverlayControllerMock, createOverlayElementMock, createPlatformMock } from '@test/mocks';
import { SessionVaultService, UnlockMode } from './session-vault.service';
import { VaultFactoryService } from './vault-factory.service';
import { Preferences } from '@capacitor/preferences';

describe('SessionVaultService', () => {
  let modal: HTMLIonModalElement;
  let service: SessionVaultService;

  let onLockCallback: () => void;

  let onPasscodeRequestedCallback: (flag: boolean) => Promise<void>;
  let mockVault: Vault;
  let preferencesVault: Vault;

  beforeEach(() => {
    const vaultObject = {
      clear: Promise.resolve(),
      getKeys: Promise.resolve([]),
      getValue: Promise.resolve(),
      initialize: Promise.resolve(),
      isEmpty: Promise.resolve(false),
      isLocked: Promise.resolve(false),
      lock: Promise.resolve(),
      setCustomPasscode: Promise.resolve(),
      setValue: Promise.resolve(),
      updateConfig: Promise.resolve(),
      unlock: Promise.resolve(),
      onLock: undefined,
      onUnlock: undefined,
      onPasscodeRequested: undefined,
    };
    preferencesVault = jasmine.createSpyObj<Vault>('PreferencesVault', vaultObject);
    mockVault = jasmine.createSpyObj<Vault>('Vault', vaultObject);
    (mockVault.onLock as jasmine.Spy).and.callFake((callback: () => void) => (onLockCallback = callback));
    (mockVault.onPasscodeRequested as jasmine.Spy).and.callFake(
      (callback: (flag: boolean) => Promise<void>) => (onPasscodeRequestedCallback = callback),
    );
    (mockVault.lock as jasmine.Spy).and.callFake(() => onLockCallback());
    mockVault.config = {
      key: 'test',
      type: VaultType.SecureStorage,
      deviceSecurityType: DeviceSecurityType.None,
    };
    modal = createOverlayElementMock('Modal');
    const factory = jasmine.createSpyObj('VaultFactoryService', { create: null });
    (factory.create as jasmine.Spy).and.returnValues(preferencesVault, mockVault);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModalController,
          useValue: createOverlayControllerMock('ModalController', modal),
        },
        { provide: Platform, useFactory: createPlatformMock },
        { provide: VaultFactoryService, useValue: factory },
      ],
    });
    service = TestBed.inject(SessionVaultService);
    (factory.create as jasmine.Spy).and.returnValues(preferencesVault, mockVault);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('initializes the preferences Vault', async () => {
      await service.initialize();
      expect(preferencesVault.initialize).toHaveBeenCalledOnceWith({
        key: 'io.ionic.auth-playground-ng-preferences',
        type: VaultType.SecureStorage,
      });
    });

    it('initializes the session vault', async () => {
      await service.initialize();
      expect(mockVault.initialize).toHaveBeenCalledOnceWith({
        key: 'io.ionic.auth-playground-ng',
        type: VaultType.SecureStorage,
        deviceSecurityType: DeviceSecurityType.None,
        lockAfterBackgrounded: 5000,
        shouldClearVaultAfterTooManyFailedAttempts: true,
        customPasscodeInvalidUnlockAttempts: 2,
        unlockVaultOnLoad: false,
      });
    });
  });

  describe('after initialization', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    describe('setUnlockMode', () => {
      describe('Device security', () => {
        it('shows a bio prompt if provisioning the permission is required', async () => {
          spyOn(Device, 'isBiometricsAllowed').and.returnValue(Promise.resolve(BiometricPermissionState.Prompt));
          spyOn(Device, 'showBiometricPrompt');
          await service.setUnlockMode('Device');
          expect(Device.showBiometricPrompt).toHaveBeenCalledTimes(1);
          expect(Device.showBiometricPrompt).toHaveBeenCalledWith({
            iosBiometricsLocalizedReason: 'Please authenticate to continue',
          });
        });

        it('does not show a bio prompt if the permission has already been granted', async () => {
          spyOn(Device, 'isBiometricsAllowed').and.returnValue(Promise.resolve(BiometricPermissionState.Granted));
          spyOn(Device, 'showBiometricPrompt');
          await service.setUnlockMode('Device');
          expect(Device.showBiometricPrompt).not.toHaveBeenCalled();
        });

        it('does not show a bio prompt if the permission has already been denied', async () => {
          spyOn(Device, 'isBiometricsAllowed').and.returnValue(Promise.resolve(BiometricPermissionState.Denied));
          spyOn(Device, 'showBiometricPrompt');
          await service.setUnlockMode('Device');
          expect(Device.showBiometricPrompt).not.toHaveBeenCalled();
        });
      });

      [
        {
          unlockMode: 'Device',
          type: VaultType.DeviceSecurity,
          deviceSecurityType: DeviceSecurityType.Both,
        },
        {
          unlockMode: 'SystemPIN',
          type: VaultType.DeviceSecurity,
          deviceSecurityType: DeviceSecurityType.SystemPasscode,
        },
        {
          unlockMode: 'SessionPIN',
          type: VaultType.CustomPasscode,
          deviceSecurityType: DeviceSecurityType.None,
        },
        {
          unlockMode: 'ForceLogin',
          type: VaultType.InMemory,
          deviceSecurityType: DeviceSecurityType.None,
        },
        {
          unlockMode: 'NeverLock',
          type: VaultType.SecureStorage,
          deviceSecurityType: DeviceSecurityType.None,
        },
      ].forEach(({ unlockMode, type, deviceSecurityType }) =>
        it(`updates the configuration for ${unlockMode}`, async () => {
          const expectedConfig = {
            ...mockVault.config,
            type,
            deviceSecurityType,
          };
          await service.setUnlockMode(unlockMode as UnlockMode);
          expect(mockVault.updateConfig).toHaveBeenCalledTimes(1);
          expect(mockVault.updateConfig).toHaveBeenCalledWith(expectedConfig);
          expect(preferencesVault.setValue).toHaveBeenCalledTimes(1);
          expect(preferencesVault.setValue).toHaveBeenCalledWith('LastUnlockMode', unlockMode);
        }),
      );
    });

    describe('initialize unlock type', () => {
      describe('on mobile', () => {
        beforeEach(() => {
          const platform = TestBed.inject(Platform);
          (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(true);
        });

        it('uses a session PIN if no system PIN is set', async () => {
          spyOn(Device, 'isSystemPasscodeSet').and.returnValue(Promise.resolve(false));
          const expectedConfig = {
            ...mockVault.config,
            type: VaultType.CustomPasscode,
            deviceSecurityType: DeviceSecurityType.None,
          };
          await service.initializeUnlockMode();
          expect(mockVault.updateConfig).toHaveBeenCalledTimes(1);
          expect(mockVault.updateConfig).toHaveBeenCalledWith(expectedConfig);
        });

        it('uses device security if a system PIN is set and biometrics is enabled', async () => {
          spyOn(Device, 'isSystemPasscodeSet').and.returnValue(Promise.resolve(true));
          spyOn(Device, 'isBiometricsEnabled').and.returnValue(Promise.resolve(true));
          const expectedConfig = {
            ...mockVault.config,
            type: VaultType.DeviceSecurity,
            deviceSecurityType: DeviceSecurityType.Both,
          };
          await service.initializeUnlockMode();
          expect(mockVault.updateConfig).toHaveBeenCalledTimes(1);
          expect(mockVault.updateConfig).toHaveBeenCalledWith(expectedConfig);
        });

        it('uses system PIN if a system PIN is set and biometrics is not enabled', async () => {
          spyOn(Device, 'isSystemPasscodeSet').and.returnValue(Promise.resolve(true));
          spyOn(Device, 'isBiometricsEnabled').and.returnValue(Promise.resolve(false));
          const expectedConfig = {
            ...mockVault.config,
            type: VaultType.DeviceSecurity,
            deviceSecurityType: DeviceSecurityType.SystemPasscode,
          };
          await service.initializeUnlockMode();
          expect(mockVault.updateConfig).toHaveBeenCalledTimes(1);
          expect(mockVault.updateConfig).toHaveBeenCalledWith(expectedConfig);
        });
      });

      describe('on web', () => {
        beforeEach(() => {
          const platform = TestBed.inject(Platform);
          (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(false);
        });

        it('does not update the config', async () => {
          await service.initializeUnlockMode();
          expect(mockVault.updateConfig).not.toHaveBeenCalled();
        });
      });
    });

    describe('can unlock', () => {
      [
        { empty: false, locked: true },
        { empty: true, locked: true },
        { empty: false, locked: false },
      ].forEach(({ empty, locked }) =>
        it(`is ${!empty && locked} for ${empty} ${locked}`, async () => {
          (mockVault.isEmpty as jasmine.Spy).and.returnValue(Promise.resolve(empty));
          (mockVault.isLocked as jasmine.Spy).and.returnValue(Promise.resolve(locked));
          expect(await service.canUnlock()).toBe(!empty && locked);
        }),
      );

      describe('when "NeverLock"', () => {
        beforeEach(() => {
          (preferencesVault.getValue as jasmine.Spy)
            .withArgs('LastUnlockMode')
            .and.returnValue(Promise.resolve('NeverLock'));
        });

        [
          { empty: false, locked: true },
          { empty: true, locked: true },
          { empty: false, locked: false },
        ].forEach(({ empty, locked }) =>
          it(`is false for ${empty} ${locked}`, async () => {
            (mockVault.isEmpty as jasmine.Spy).and.returnValue(Promise.resolve(empty));
            (mockVault.isLocked as jasmine.Spy).and.returnValue(Promise.resolve(locked));
            expect(await service.canUnlock()).toBe(false);
          }),
        );
      });
    });

    describe('onPasscodeRequested', () => {
      beforeEach(async () => {
        (modal.onDidDismiss as jasmine.Spy).and.returnValue(Promise.resolve({ role: 'cancel' }));
        await service.getValue('just-do-this-to-init-the-vault');
      });

      [true, false].forEach((setPasscode) => {
        it(`creates a PIN dialog, setting passcode: ${setPasscode}`, async () => {
          const modalController = TestBed.inject(ModalController);
          await onPasscodeRequestedCallback(setPasscode);
          expect(modalController.create).toHaveBeenCalledTimes(1);
          expect(modalController.create).toHaveBeenCalledWith({
            backdropDismiss: false,
            component: PinDialogComponent,
            componentProps: {
              setPasscodeMode: setPasscode,
            },
          });
        });
      });

      it('presents the modal', async () => {
        await onPasscodeRequestedCallback(false);
        expect(modal.present).toHaveBeenCalledTimes(1);
      });

      it('sets the custom passcode to the PIN', async () => {
        (modal.onDidDismiss as jasmine.Spy).and.returnValue(Promise.resolve({ data: '4203', role: 'OK' }));
        await onPasscodeRequestedCallback(false);
        expect(mockVault.setCustomPasscode).toHaveBeenCalledTimes(1);
        expect(mockVault.setCustomPasscode).toHaveBeenCalledWith('4203');
      });

      it('sets the custom passcode to and empty string if the PIN is undefined', async () => {
        await onPasscodeRequestedCallback(false);
        expect(mockVault.setCustomPasscode).toHaveBeenCalledTimes(1);
        expect(mockVault.setCustomPasscode).toHaveBeenCalledWith('');
      });
    });

    describe('getConfig', () => {
      it('resolves the config', () => {
        expect(service.getConfig()).toEqual(mockVault.config);
      });
    });

    describe('get keys', () => {
      it('calls the vault get keys', async () => {
        await service.getKeys();
        expect(mockVault.getKeys).toHaveBeenCalledTimes(1);
      });
    });

    describe('get value', () => {
      it('calls the vault get value', async () => {
        await service.getValue('foo-key');
        expect(mockVault.getValue).toHaveBeenCalledTimes(1);
        expect(mockVault.getValue).toHaveBeenCalledWith('foo-key');
      });
    });

    describe('lock', () => {
      it('calls the vault lock', async () => {
        await service.lock();
        expect(mockVault.lock).toHaveBeenCalledTimes(1);
      });
    });

    describe('set value', () => {
      it('calls the vault set value', async () => {
        await service.setValue('foo-key', 'some random value');
        expect(mockVault.setValue).toHaveBeenCalledTimes(1);
        expect(mockVault.setValue).toHaveBeenCalledWith('foo-key', 'some random value');
      });
    });

    describe('unlock', () => {
      it('calls the vault unlock', async () => {
        await service.unlock();
        expect(mockVault.unlock).toHaveBeenCalledTimes(1);
      });
    });

    describe('setAuthVendor', () => {
      it('sets the auth provider value in preferences', async () => {
        spyOn(Preferences, 'set');
        await service.setAuthVendor('AWS');
        expect(Preferences.set).toHaveBeenCalledTimes(1);
        expect(Preferences.set).toHaveBeenCalledWith({ key: 'AuthVendor', value: 'AWS' });
      });
    });

    describe('getAuthVendor', () => {
      it('resolves the set auth provider', async () => {
        spyOn(Preferences, 'get');
        (Preferences.get as jasmine.Spy).withArgs({ key: 'AuthVendor' }).and.resolveTo({ value: 'Azure' });
        expect(await service.getAuthVendor()).toEqual('Azure');
      });
    });

    describe('token storage provider methods', () => {
      describe('clear', () => {
        it('calls the vault clear', async () => {
          await service.clear();
          expect(mockVault.clear).toHaveBeenCalledTimes(1);
        });
      });

      describe('getAccessToken', () => {
        describe('without a token name', () => {
          it('gets the access token using the "AccessToken" key', async () => {
            await service.getAccessToken();
            expect(mockVault.getValue).toHaveBeenCalledTimes(1);
            expect(mockVault.getValue).toHaveBeenCalledWith('AccessToken');
          });

          it('resolves the access token', async () => {
            (mockVault.getValue as jasmine.Spy)
              .withArgs('AccessToken')
              .and.returnValue(Promise.resolve('my-access-token'));
            expect(await service.getAccessToken()).toEqual('my-access-token');
          });
        });

        describe('with a token name', () => {
          it('gets the access token using the "AccessToken" plus token name', async () => {
            await service.getAccessToken('FooBar');
            expect(mockVault.getValue).toHaveBeenCalledTimes(1);
            expect(mockVault.getValue).toHaveBeenCalledWith('AccessTokenFooBar');
          });

          it('resolves the access token', async () => {
            (mockVault.getValue as jasmine.Spy)
              .withArgs('AccessTokenFooBar')
              .and.returnValue(Promise.resolve('my-access-token'));
            expect(await service.getAccessToken('FooBar')).toEqual('my-access-token');
          });
        });
      });

      describe('getAuthResponse', () => {
        it('gets the auth response using the "AuthResponse" key', async () => {
          await service.getAuthResponse();
          expect(mockVault.getValue).toHaveBeenCalledTimes(1);
          expect(mockVault.getValue).toHaveBeenCalledWith('AuthResponse');
        });

        it('resolves the auth response', async () => {
          (mockVault.getValue as jasmine.Spy)
            .withArgs('AuthResponse')
            .and.returnValue(Promise.resolve({ foo: 'bar', bar: 'foo', baz: 'qux' }));
          expect(await service.getAuthResponse()).toEqual({ foo: 'bar', bar: 'foo', baz: 'qux' });
        });
      });

      describe('getIdToken', () => {
        it('gets the id token using the "IdToken" key', async () => {
          await service.getIdToken();
          expect(mockVault.getValue).toHaveBeenCalledTimes(1);
          expect(mockVault.getValue).toHaveBeenCalledWith('IdToken');
        });

        it('resolves the id token', async () => {
          (mockVault.getValue as jasmine.Spy).withArgs('IdToken').and.returnValue(Promise.resolve('my-id-token'));
          expect(await service.getIdToken()).toEqual('my-id-token');
        });
      });

      describe('getRefreshToken', () => {
        it('gets the refresh token using the "RefreshToken" key', async () => {
          await service.getRefreshToken();
          expect(mockVault.getValue).toHaveBeenCalledTimes(1);
          expect(mockVault.getValue).toHaveBeenCalledWith('RefreshToken');
        });

        it('resolves the refresh token', async () => {
          (mockVault.getValue as jasmine.Spy)
            .withArgs('RefreshToken')
            .and.returnValue(Promise.resolve('my-refresh-token'));
          expect(await service.getRefreshToken()).toEqual('my-refresh-token');
        });
      });

      describe('setAccessToken', () => {
        it('sets the access token using the "AccessToken" key', async () => {
          await service.setAccessToken('some-access-token');
          expect(mockVault.setValue).toHaveBeenCalledTimes(1);
          expect(mockVault.setValue).toHaveBeenCalledWith('AccessToken', 'some-access-token');
        });

        it('appends the tokenName when specified', async () => {
          await service.setAccessToken('some-access-token', 'FooBar');
          expect(mockVault.setValue).toHaveBeenCalledTimes(1);
          expect(mockVault.setValue).toHaveBeenCalledWith('AccessTokenFooBar', 'some-access-token');
        });
      });

      describe('setAuthResponse', () => {
        it('sets the auth response using "AuthResponse" key', async () => {
          await service.setAuthResponse({ foo: 'bar', baz: 'qux' });
          expect(mockVault.setValue).toHaveBeenCalledTimes(1);
          expect(mockVault.setValue).toHaveBeenCalledWith('AuthResponse', { foo: 'bar', baz: 'qux' });
        });
      });

      describe('setIdToken', () => {
        it('sets the id token using "IdToken" key', async () => {
          await service.setIdToken('some-id-token');
          expect(mockVault.setValue).toHaveBeenCalledTimes(1);
          expect(mockVault.setValue).toHaveBeenCalledWith('IdToken', 'some-id-token');
        });
      });

      describe('setRefreshToken', () => {
        it('sets the refresh token using "RefreshToken" key', async () => {
          await service.setRefreshToken('some-refresh-token');
          expect(mockVault.setValue).toHaveBeenCalledTimes(1);
          expect(mockVault.setValue).toHaveBeenCalledWith('RefreshToken', 'some-refresh-token');
        });
      });
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { PinDialogComponent } from '@app/pin-dialog/pin-dialog.component';
import { DeviceSecurityType, IdentityVaultConfig, Vault, VaultType } from '@ionic-enterprise/identity-vault';
import { ModalController, Platform } from '@ionic/angular';
import { createOverlayControllerMock, createOverlayElementMock, createPlatformMock } from '@test/mocks';
import { SessionVaultService, UnlockMode } from './session-vault.service';
import { VaultFactoryService } from './vault-factory.service';

describe('SessionVaultService', () => {
  let modal: HTMLIonModalElement;
  let service: SessionVaultService;

  let onLockCallback: () => void;
  let onPassocodeRequestedCallback: (flag: boolean) => Promise<void>;
  let mockVault: Vault;

  beforeEach(() => {
    mockVault = jasmine.createSpyObj<Vault>('Vault', {
      clear: Promise.resolve(),
      isEmpty: Promise.resolve(false),
      isLocked: Promise.resolve(false),
      lock: Promise.resolve(),
      setCustomPasscode: Promise.resolve(),
      updateConfig: Promise.resolve(),
      unlock: Promise.resolve(),
      onLock: undefined,
      onPasscodeRequested: undefined,
      onUnlock: undefined,
    });
    (mockVault.onLock as jasmine.Spy).and.callFake((callback: () => void) => (onLockCallback = callback));
    (mockVault.onPasscodeRequested as jasmine.Spy).and.callFake(
      (callback: (flag: boolean) => Promise<void>) => (onPassocodeRequestedCallback = callback),
    );
    (mockVault.lock as jasmine.Spy).and.callFake(() => onLockCallback());
    modal = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModalController,
          useValue: createOverlayControllerMock('ModalController', modal),
        },
        { provide: Platform, useFactory: createPlatformMock },
        {
          provide: VaultFactoryService,
          useValue: jasmine.createSpyObj('VaultFactoryService', {
            create: mockVault,
          }),
        },
      ],
    });
    service = TestBed.inject(SessionVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setUnlockType', () => {
    [
      {
        unlockMode: 'Biometrics',
        type: VaultType.DeviceSecurity,
        deviceSecurityType: DeviceSecurityType.Biometrics,
      },
      {
        unlockMode: 'BiometricsWithPasscode',
        type: VaultType.DeviceSecurity,
        deviceSecurityType: DeviceSecurityType.Both,
      },
      {
        unlockMode: 'SystemPasscode',
        type: VaultType.DeviceSecurity,
        deviceSecurityType: DeviceSecurityType.SystemPasscode,
      },
      {
        unlockMode: 'CustomPasscode',
        type: VaultType.CustomPasscode,
        deviceSecurityType: DeviceSecurityType.None,
      },
      {
        unlockMode: 'SecureStorage',
        type: VaultType.SecureStorage,
        deviceSecurityType: DeviceSecurityType.None,
      },
    ].forEach(({ unlockMode, type, deviceSecurityType }) =>
      it(`updates the configuration for ${unlockMode}`, async () => {
        const expectedConfig = {
          ...(mockVault.config as IdentityVaultConfig),
          type,
          deviceSecurityType,
        };
        await service.setUnlockMode(unlockMode as UnlockMode);
        expect(mockVault.updateConfig).toHaveBeenCalledTimes(1);
        expect(mockVault.updateConfig).toHaveBeenCalledWith(expectedConfig);
      }),
    );
  });

  describe('clear session', () => {
    it('clears the session', async () => {
      await service.clear();
      expect(mockVault.clear).toHaveBeenCalledTimes(1);
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
  });

  describe('isLocked', () => {
    [true, false].forEach((value: boolean) =>
      it('passes through to the vault', async () => {
        (mockVault.isLocked as jasmine.Spy).and.returnValue(Promise.resolve(value));
        expect(await mockVault.isLocked()).toEqual(value);
      }),
    );
  });

  describe('unlock', () => {
    it('passes through to the vault', async () => {
      await service.unlockVault();
      expect(mockVault.unlock).toHaveBeenCalledTimes(1);
    });
  });

  describe('onPasscodeRequested', () => {
    beforeEach(() => {
      (modal.onDidDismiss as jasmine.Spy).and.returnValue(Promise.resolve({ role: 'cancel' }));
    });

    [true, false].forEach((setPasscode) => {
      it(`creates a PIN dialog, setting passcode: ${setPasscode}`, async () => {
        const modalController = TestBed.inject(ModalController);
        await onPassocodeRequestedCallback(setPasscode);
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
      await onPassocodeRequestedCallback(false);
      expect(modal.present).toHaveBeenCalledTimes(1);
    });

    it('sets the custom passcode to the PIN', async () => {
      (modal.onDidDismiss as jasmine.Spy).and.returnValue(Promise.resolve({ data: '4203', role: 'OK' }));
      await onPassocodeRequestedCallback(false);
      expect(mockVault.setCustomPasscode).toHaveBeenCalledTimes(1);
      expect(mockVault.setCustomPasscode).toHaveBeenCalledWith('4203');
    });

    it('sets the custom passcode to and empty string if the PIN is undefined', async () => {
      await onPassocodeRequestedCallback(false);
      expect(mockVault.setCustomPasscode).toHaveBeenCalledTimes(1);
      expect(mockVault.setCustomPasscode).toHaveBeenCalledWith('');
    });
  });
});

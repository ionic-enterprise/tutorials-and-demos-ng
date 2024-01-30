import { TestBed } from '@angular/core/testing';
import { SessionVaultService } from './session-vault.service';
import { DeviceSecurityType, Vault, VaultType } from '@ionic-enterprise/identity-vault';
import { VaultFactory } from './vault.factory';

describe('SessionVaultService', () => {
  let service: SessionVaultService;
  let mockVault: Vault;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    mockVault = jasmine.createSpyObj<Vault>('Vault', {
      clear: Promise.resolve(),
      initialize: Promise.resolve(),
      getValue: Promise.resolve(null),
      removeValue: Promise.resolve(),
      setValue: Promise.resolve(),
      isEmpty: Promise.resolve(false),
      isLocked: Promise.resolve(false),
      lock: Promise.resolve(),
      setCustomPasscode: Promise.resolve(),
      updateConfig: Promise.resolve(),
      unlock: Promise.resolve(),
      onError: undefined,
      onLock: undefined,
      onPasscodeRequested: undefined,
      onUnlock: undefined,
    });
    spyOn(VaultFactory, 'create').and.returnValue(mockVault);
    service = TestBed.inject(SessionVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize', () => {
    it('initializes the vault', async () => {
      await service.initialize();
      expect(mockVault.initialize).toHaveBeenCalledOnceWith({
        key: 'io.ionic.gettingstartediv',
        type: VaultType.SecureStorage,
        deviceSecurityType: DeviceSecurityType.None,
        lockAfterBackgrounded: 2000,
      });
    });
  });

  describe('store session', () => {
    it('stores the session in the vault', async () => {
      await service.storeSession({
        email: 'test@ionic.io',
        firstName: 'Test',
        lastName: 'User',
        accessToken: 'foo',
        refreshToken: 'bar',
      });
      expect(mockVault.setValue).toHaveBeenCalledOnceWith('session', {
        email: 'test@ionic.io',
        firstName: 'Test',
        lastName: 'User',
        accessToken: 'foo',
        refreshToken: 'bar',
      });
    });
  });

  describe('get session', () => {
    beforeEach(() => {
      (mockVault.getValue as jasmine.Spy).and.resolveTo({
        email: 'test@ionic.io',
        firstName: 'Test',
        lastName: 'User',
        accessToken: 'foo',
        refreshToken: 'bar',
      });
    });

    describe('if the vault is empty', () => {
      beforeEach(() => {
        (mockVault.isEmpty as jasmine.Spy).and.resolveTo(true);
      });

      it('does not get the session from the vault', async () => {
        await service.getSession();
        expect(mockVault.getValue).not.toHaveBeenCalled();
      });

      it('resolves null', async () => {
        expect(await service.getSession()).toEqual(null);
      });
    });

    describe('if the vault is not empty', () => {
      beforeEach(() => {
        (mockVault.isEmpty as jasmine.Spy).and.resolveTo(false);
      });

      it('gets the session from the vault', async () => {
        await service.getSession();
        expect(mockVault.getValue).toHaveBeenCalledOnceWith('session');
      });

      it('resolves the session from the vault', async () => {
        expect(await service.getSession()).toEqual({
          email: 'test@ionic.io',
          firstName: 'Test',
          lastName: 'User',
          accessToken: 'foo',
          refreshToken: 'bar',
        });
      });
    });
  });

  describe('clear session', () => {
    it('removes the session from the vault', async () => {
      await service.clearSession();
      expect(mockVault.clear).toHaveBeenCalledOnceWith();
    });
  });

  describe('lock', () => {
    it('locks the vault', async () => {
      await service.lock();
      expect(mockVault.lock).toHaveBeenCalledOnceWith();
    });
  });

  describe('update unlock mode', () => {
    beforeEach(() => {
      mockVault.config = {
        key: 'io.ionic.gettingstartediv',
        type: VaultType.CustomPasscode,
        deviceSecurityType: DeviceSecurityType.Biometrics,
        lockAfterBackgrounded: 2000,
      };
    });

    it('updates the config for "BiometricsWithPasscode"', async () => {
      await service.updateUnlockMode('BiometricsWithPasscode');
      expect(mockVault.updateConfig).toHaveBeenCalledOnceWith({
        key: 'io.ionic.gettingstartediv',
        type: VaultType.DeviceSecurity,
        deviceSecurityType: DeviceSecurityType.Both,
        lockAfterBackgrounded: 2000,
      });
    });

    it('updates the config for "InMemory"', async () => {
      await service.updateUnlockMode('InMemory');
      expect(mockVault.updateConfig).toHaveBeenCalledOnceWith({
        key: 'io.ionic.gettingstartediv',
        type: VaultType.InMemory,
        deviceSecurityType: DeviceSecurityType.None,
        lockAfterBackgrounded: 2000,
      });
    });

    it('updates the config for "SecureStorage"', async () => {
      await service.updateUnlockMode('SecureStorage');
      expect(mockVault.updateConfig).toHaveBeenCalledOnceWith({
        key: 'io.ionic.gettingstartediv',
        type: VaultType.SecureStorage,
        deviceSecurityType: DeviceSecurityType.None,
        lockAfterBackgrounded: 2000,
      });
    });
  });
});

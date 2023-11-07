import { DeviceSecurityType, VaultType } from '@ionic-enterprise/identity-vault';
import { Subject } from 'rxjs';
import { SessionVaultService } from './session-vault.service';

export const createSessionVaultServiceMock = () => {
  const service = jasmine.createSpyObj<SessionVaultService>('SessionVaultService', {
    canUnlock: Promise.resolve(false),
    initializeUnlockMode: Promise.resolve(),
    setUnlockMode: Promise.resolve(),
    clear: Promise.resolve(),
    getConfig: {
      key: 'io.ionic.auth-playground-ng',
      type: VaultType.SecureStorage,
      deviceSecurityType: DeviceSecurityType.None,
      lockAfterBackgrounded: 2000,
      shouldClearVaultAfterTooManyFailedAttempts: true,
      customPasscodeInvalidUnlockAttempts: 2,
      unlockVaultOnLoad: false,
    },
    getKeys: Promise.resolve([]),
    getValue: Promise.resolve(),
    lock: Promise.resolve(),
    setValue: Promise.resolve(),
    unlock: Promise.resolve(),
    setAuthVendor: Promise.resolve(),
    getAuthVendor: Promise.resolve(null),
  });
  (service as any).locked = new Subject();
  return service;
};

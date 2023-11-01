import { Subject } from 'rxjs';

export const createSessionVaultServiceMock = () => {
  const service = jasmine.createSpyObj('SessionVaultService', {
    setSession: Promise.resolve(),
    getSession: Promise.resolve(),
    clear: Promise.resolve(),
    canHideContentsInBackground: true,
    canUseBiometrics: Promise.resolve(true),
    canUseCustomPasscode: Promise.resolve(true),
    canUseSystemPasscode: Promise.resolve(true),
    isHidingContentsInBackground: Promise.resolve(false),
    getUnlockMode: Promise.resolve('SecureStorage'),
  });
  (service as any).locked = new Subject();
  return service;
};

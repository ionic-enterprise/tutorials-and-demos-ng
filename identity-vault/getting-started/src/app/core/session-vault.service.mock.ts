import { Subject } from 'rxjs';
import { SessionVaultService } from './session-vault.service';

export const createSessionVaultServiceMock = () => {
  const service = jasmine.createSpyObj<SessionVaultService>('SessionVaultService', {
    initialize: Promise.resolve(),
    storeSession: Promise.resolve(),
    getSession: Promise.resolve(null),
    clearSession: Promise.resolve(),
    lock: Promise.resolve(),
    updateUnlockMode: Promise.resolve(),
  });
  (service as any).locked$ = new Subject();
  return service;
};

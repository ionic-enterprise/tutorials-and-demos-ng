import { EncryptionService } from './encryption.service';

export const createEncryptionServiceMock = () =>
  jasmine.createSpyObj<EncryptionService>('EncryptionService', {
    getDatabaseKey: Promise.resolve(''),
  });

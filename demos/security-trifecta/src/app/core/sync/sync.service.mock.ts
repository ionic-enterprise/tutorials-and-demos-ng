import { SyncService } from './sync.service';

export const createSyncServiceMock = () =>
  jasmine.createSpyObj<SyncService>('SyncService', {
    execute: Promise.resolve(),
  });

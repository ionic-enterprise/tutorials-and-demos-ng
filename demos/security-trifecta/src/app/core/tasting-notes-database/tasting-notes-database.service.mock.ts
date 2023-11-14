import { TastingNotesDatabaseService } from './tasting-notes-database.service';

export const createTastingNotesDatabaseServiceMock = () =>
  jasmine.createSpyObj<TastingNotesDatabaseService>('TastingNotesDatabaseService', {
    clearSyncStatuses: Promise.resolve(),
    getAll: Promise.resolve([]),
    save: Promise.resolve(null as any),
    remove: Promise.resolve(),
    pruneOthers: Promise.resolve(),
    upsert: Promise.resolve(),
  });

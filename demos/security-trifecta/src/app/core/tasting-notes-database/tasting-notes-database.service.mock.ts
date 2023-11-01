import { TastingNotesDatabaseService } from './tasting-notes-database.service';

export const createTastingNotesDatabaseServiceMock = () =>
  jasmine.createSpyObj<TastingNotesDatabaseService>('TastingNotesDatabaseService', {
    clearSyncStatuses: Promise.resolve(),
    getAll: Promise.resolve([]),
    save: Promise.resolve(null),
    remove: Promise.resolve(),
    pruneOthers: Promise.resolve(),
    upsert: Promise.resolve(),
  });

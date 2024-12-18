import { TastingNotesDatabaseService } from './tasting-notes-database.service';

export const createTastingNotesDatabaseServiceMock = () =>
  jasmine.createSpyObj<TastingNotesDatabaseService>('TastingNotesDatabaseService', {
    clearSyncStatuses: Promise.resolve(),
    getAll: Promise.resolve([]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    save: Promise.resolve(null as any),
    remove: Promise.resolve(),
    pruneOthers: Promise.resolve(),
    upsert: Promise.resolve(),
  });

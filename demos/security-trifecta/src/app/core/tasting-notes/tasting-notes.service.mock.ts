import { TastingNotesService } from './tasting-notes.service';

export const createTastingNotesServiceMock = () =>
  jasmine.createSpyObj<TastingNotesService>(
    'TastingNotesService',
    {
      loadDatabaseFromApi: Promise.resolve(),
      refresh: Promise.resolve(),
      remove: Promise.resolve(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      save: Promise.resolve(null as any),
      find: Promise.resolve(undefined),
    },
    { data: [] },
  );

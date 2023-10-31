import { TastingNotesService } from './tasting-notes.service';

export const createTastingNotesServiceMock = () =>
  jasmine.createSpyObj<TastingNotesService>(
    'TastingNotesService',
    {
      loadDatabaseFromApi: Promise.resolve(),
      refresh: Promise.resolve(),
      remove: Promise.resolve(),
      save: Promise.resolve(null),
      find: Promise.resolve(undefined),
    },
    { data: [] },
  );

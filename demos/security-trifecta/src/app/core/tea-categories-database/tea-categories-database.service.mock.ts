import { TeaCategoriesDatabaseService } from './tea-categories-database.service';

export const createTeaCategoriesDatabaseServiceMock = () =>
  jasmine.createSpyObj<TeaCategoriesDatabaseService>('TeaCategoriesDatabaseService', {
    getAll: Promise.resolve([]),
    upsert: Promise.resolve(),
    pruneOthers: Promise.resolve(),
  });

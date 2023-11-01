import { TeaCategoriesService } from './tea-categories.service';

export const createTeaCategoriesServiceMock = () =>
  jasmine.createSpyObj<TeaCategoriesService>(
    'TeaCategoriesService',
    {
      loadDatabaseFromApi: Promise.resolve(),
      refresh: Promise.resolve(),
      find: Promise.resolve(undefined),
    },
    { data: [] },
  );

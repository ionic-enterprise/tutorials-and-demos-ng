import { EMPTY } from 'rxjs';
import { TeaCategoriesApiService } from './tea-categories-api.service';

export const createTeaCategoriesApiServiceMock = () =>
  jasmine.createSpyObj<TeaCategoriesApiService>('TeaCategoriesApiService', {
    getAll: EMPTY,
  });

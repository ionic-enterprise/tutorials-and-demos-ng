import { EMPTY } from 'rxjs';
import { TastingNotesApiService } from './tasting-notes-api.service';

export const createTastingNotesApiServiceMock = () =>
  jasmine.createSpyObj<TastingNotesApiService>('TastingNotesApiService', {
    getAll: EMPTY,
    remove: EMPTY,
    save: EMPTY,
  });

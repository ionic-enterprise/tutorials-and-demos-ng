import { EMPTY } from 'rxjs';
import { TastingNotesService } from './tasting-notes.service';

export const createTastingNotesServiceMock = () =>
  jasmine.createSpyObj<TastingNotesService>('TastingNotesService', {
    getAll: EMPTY,
    delete: EMPTY,
    save: EMPTY,
  });

import { EMPTY } from 'rxjs';
import { TeaService } from './tea.service';

export const createTeaServiceMock = () =>
  jasmine.createSpyObj<TeaService>('TeaService', {
    getAll: EMPTY,
  });

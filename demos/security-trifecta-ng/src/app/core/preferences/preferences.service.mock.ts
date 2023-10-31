import { Subject } from 'rxjs';
import { PreferencesService } from './preferences.service';

export const createPreferencesServiceMock = () => {
  const spy = jasmine.createSpyObj<PreferencesService>('PreferencesService', {
    load: Promise.resolve(),
    setPrefersDarkMode: Promise.resolve(),
  });
  (spy as any).prefersDarkMode = false;
  (spy as any).preferencesChanged$ = new Subject();
  return spy;
};

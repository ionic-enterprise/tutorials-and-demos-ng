import { EMPTY } from 'rxjs';
import { AuthenticationService } from './authentication.service';

export const createAuthenticationServiceMock = () =>
  jasmine.createSpyObj<AuthenticationService>('AuthenticationService', {
    login: EMPTY,
    logout: EMPTY,
  });

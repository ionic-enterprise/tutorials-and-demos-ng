import { SessionService } from './session.service';

export const createSessionServiceMock = () =>
  jasmine.createSpyObj<SessionService>('SessionService', {
    clear: Promise.resolve(),
    getSession: Promise.resolve(null),
    setSession: Promise.resolve(),
  });

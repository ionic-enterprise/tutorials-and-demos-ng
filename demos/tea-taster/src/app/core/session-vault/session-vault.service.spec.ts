import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { Session } from '@app/models';
import { SessionVaultService } from './session-vault.service';

describe('SessionVaultService', () => {
  let service: SessionVaultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionVaultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('set', () => {
    it('saves the session in preferences', async () => {
      spyOn(Preferences, 'set');
      const session: Session = {
        user: {
          id: 42,
          firstName: 'Joe',
          lastName: 'Tester',
          email: 'test@test.org',
        },
        token: '19940059fkkf039',
      };
      await service.set(session);
      expect(Preferences.set).toHaveBeenCalledTimes(1);
      expect(Preferences.set).toHaveBeenCalledWith({
        key: 'auth-session',
        value: JSON.stringify(session),
      });
    });
  });

  describe('get session', () => {
    it('gets the session from preferences', async () => {
      spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: null }));
      await service.get();
      expect(Preferences.get).toHaveBeenCalledTimes(1);
      expect(Preferences.get).toHaveBeenCalledWith({
        key: 'auth-session',
      });
    });

    describe('with a session', () => {
      const session: Session = {
        user: {
          id: 42,
          firstName: 'Joe',
          lastName: 'Tester',
          email: 'test@test.org',
        },
        token: '19940059fkkf039',
      };
      beforeEach(() => {
        spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: JSON.stringify(session) }));
      });

      it('resolves the session', async () => {
        expect(await service.get()).toEqual(session);
      });
    });

    describe('without a session', () => {
      beforeEach(() => {
        spyOn(Preferences, 'get').and.returnValue(Promise.resolve({ value: null }));
      });

      it('resolves null', async () => {
        expect(await service.get()).toEqual(null);
      });
    });
  });

  describe('clear', () => {
    it('clears the preferences', async () => {
      spyOn(Preferences, 'remove');
      await service.clear();
      expect(Preferences.remove).toHaveBeenCalledTimes(1);
      expect(Preferences.remove).toHaveBeenCalledWith({
        key: 'auth-session',
      });
    });
  });
});

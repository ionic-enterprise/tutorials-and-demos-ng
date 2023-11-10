import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { Preferences } from '@capacitor/preferences';

describe('SessionService', () => {
  let service: SessionService;

  const testAuthResult: any = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    idToken: 'test-id-token',
  };

  beforeEach(() => {
    service = TestBed.inject(SessionService);
  });

  it('builds', () => {
    expect(service).toBeTruthy();
  });

  describe('clear', () => {
    beforeEach(() => {
      spyOn(Preferences, 'remove');
    });

    it('removes the session', () => {
      service.clear();
      expect(Preferences.remove).toHaveBeenCalledOnceWith({ key: 'session' });
    });
  });

  describe('get session', () => {
    beforeEach(() => {
      spyOn(Preferences, 'get')
        .and.resolveTo({ value: null })
        .withArgs({ key: 'session' })
        .and.resolveTo({ value: JSON.stringify(testAuthResult) });
    });

    it('gets the session', () => {
      service.getSession();
      expect(Preferences.get).toHaveBeenCalledOnceWith({ key: 'session' });
    });

    it('resolves the session', async () => {
      expect(await service.getSession()).toEqual(testAuthResult);
    });

    it('handles the session not being set', async () => {
      (Preferences.get as jasmine.Spy).withArgs({ key: 'session' }).and.resolveTo({ value: null });
      expect(await service.getSession()).toEqual(null);
    });
  });

  describe('set session', () => {
    beforeEach(() => {
      spyOn(Preferences, 'set');
    });

    it('sets the session', async () => {
      await service.setSession(testAuthResult);
      expect(Preferences.set).toHaveBeenCalledOnceWith({ key: 'session', value: JSON.stringify(testAuthResult) });
    });
  });
});

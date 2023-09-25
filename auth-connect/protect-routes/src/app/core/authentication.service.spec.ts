import { TestBed } from '@angular/core/testing';
import { AuthConnect } from '@ionic-enterprise/auth';
import { AuthenticationService } from './authentication.service';
import { SessionService } from './session.service';
import { createSessionServiceMock } from './session.service.mock';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  const testAuthResult: any = {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    idToken: 'test-id-token',
  };

  beforeEach(() => {
    spyOn(AuthConnect, 'login').and.resolveTo(testAuthResult);
    spyOn(AuthConnect, 'logout').and.resolveTo();
    spyOn(AuthConnect, 'setup').and.resolveTo();
    TestBed.configureTestingModule({}).overrideProvider(SessionService, { useFactory: createSessionServiceMock });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('performs a setup', () => {
    expect(AuthConnect.setup).toHaveBeenCalledTimes(1);
  });

  describe('`is authenticated', () => {
    it('resolves false if there is no stored auth result', async () => {
      const session = TestBed.inject(SessionService);
      (session.getSession as jasmine.Spy).and.resolveTo(null);
      expect(await service.isAuthenticated()).toBe(false);
    });

    it('resolves true if there is a stored auth result', async () => {
      const session = TestBed.inject(SessionService);
      (session.getSession as jasmine.Spy).and.resolveTo(testAuthResult);
      expect(await service.isAuthenticated()).toBe(true);
    });
  });

  describe('login', () => {
    it('calls the login', async () => {
      await service.login();
      expect(AuthConnect.login).toHaveBeenCalledTimes(1);
    });

    it('saves the result of the login', async () => {
      const session = TestBed.inject(SessionService);
      await service.login();
      expect(session.setSession).toHaveBeenCalledOnceWith(testAuthResult);
    });
  });

  describe('logout', () => {
    describe('when authenticated', () => {
      beforeEach(() => {
        const session = TestBed.inject(SessionService);
        (session.getSession as jasmine.Spy).and.resolveTo(testAuthResult);
      });

      it('calls the logout', async () => {
        await service.logout();
        expect(AuthConnect.logout).toHaveBeenCalledTimes(1);
      });

      it('clears the session', async () => {
        const session = TestBed.inject(SessionService);
        await service.logout();
        expect(session.clear).toHaveBeenCalledTimes(1);
      });
    });

    describe('when not authenticated', () => {
      beforeEach(() => {
        const session = TestBed.inject(SessionService);
        (session.getSession as jasmine.Spy).and.resolveTo(null);
      });

      it('does nothing', async () => {
        const session = TestBed.inject(SessionService);
        await service.logout();
        expect(AuthConnect.logout).not.toHaveBeenCalled();
        expect(session.clear).not.toHaveBeenCalled();
      });
    });
  });
});
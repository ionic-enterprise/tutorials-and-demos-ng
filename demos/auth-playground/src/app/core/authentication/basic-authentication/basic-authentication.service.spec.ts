import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from '@app/models';
import { environment } from '@env/environment';
import { SessionVaultService } from '../../session-vault/session-vault.service';
import { createSessionVaultServiceMock } from '../../testing';
import { BasicAuthenticationService } from './basic-authentication.service';

type AuthResponse = {
  success: boolean;
  token?: string;
  user?: User;
};

describe('BasicAuthenticationService', () => {
  let httpTestingController: HttpTestingController;
  let service: BasicAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }).overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(BasicAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('POSTs the login', () => {
      service.login('thank.you@forthefish.com', 'solongDude');
      const req = httpTestingController.expectOne(`${environment.dataService}/login`);
      expect(req.request.method).toEqual('POST');
      req.flush({ success: true });
      httpTestingController.verify();
    });

    it('passes the credentials in the body', () => {
      service.login('thank.you@forthefish.com', 'solongDude');
      const req = httpTestingController.expectOne(`${environment.dataService}/login`);
      expect(req.request.body).toEqual({
        username: 'thank.you@forthefish.com',
        password: 'solongDude',
      });
      req.flush({ success: true });
      httpTestingController.verify();
    });

    describe('on success', () => {
      let response: AuthResponse;
      beforeEach(() => {
        response = {
          success: true,
          token: '48499501093kf00399sg',
          user: {
            id: 42,
            firstName: 'Douglas',
            lastName: 'Adams',
            email: 'thank.you@forthefish.com',
          },
        };
      });

      it('saves the session to the vault', async () => {
        const vault = TestBed.inject(SessionVaultService);
        const p = service.login('thank.you@forthefish.com', 'solongDude');
        const req = httpTestingController.expectOne(`${environment.dataService}/login`);
        req.flush(response);
        httpTestingController.verify();
        await expectAsync(p).toBeResolved();
        expect(vault.setValue).toHaveBeenCalledTimes(1);
        expect(vault.setValue).toHaveBeenCalledWith('session', {
          token: '48499501093kf00399sg',
          user: {
            id: 42,
            firstName: 'Douglas',
            lastName: 'Adams',
            email: 'thank.you@forthefish.com',
          },
        });
      });
    });

    describe('on failure', () => {
      let response: AuthResponse;
      beforeEach(() => {
        response = { success: false };
      });

      it('does not save the session', async () => {
        const vault = TestBed.inject(SessionVaultService);
        const p = service.login('thank.you@forthefish.com', 'solongDude');
        const req = httpTestingController.expectOne(`${environment.dataService}/login`);
        req.flush(response);
        await expectAsync(p).toBeRejected();
        expect(vault.setValue).not.toHaveBeenCalled();
      });
    });
  });

  describe('logout', () => {
    it('POSTs the logout', async () => {
      const p = service.logout();
      const req = httpTestingController.expectOne(`${environment.dataService}/logout`);
      req.flush({});
      httpTestingController.verify();
      await expectAsync(p).toBeResolved();
    });

    it('clears the vault', async () => {
      const vault = TestBed.inject(SessionVaultService);
      const p = service.logout();
      const req = httpTestingController.expectOne(`${environment.dataService}/logout`);
      req.flush({});
      httpTestingController.verify();
      await p;
      expect(vault.clear).toHaveBeenCalledTimes(1);
    });
  });

  describe('get access token', () => {
    it('gets the session', async () => {
      const vault = TestBed.inject(SessionVaultService);
      await service.getAccessToken();
      expect(vault.getValue).toHaveBeenCalledTimes(1);
      expect(vault.getValue).toHaveBeenCalledWith('session');
    });

    it('returns the session', async () => {
      const vault = TestBed.inject(SessionVaultService);
      (vault.getValue as jasmine.Spy).withArgs('session').and.returnValue(
        Promise.resolve({
          token: '484w9501c93kf00399sg',
          user: {
            id: 42,
            firstName: 'Douglas',
            lastName: 'Adams',
            email: 'thank.you@forthefish.com',
          },
        }),
      );
      const token = await service.getAccessToken();
      expect(token).toEqual('484w9501c93kf00399sg');
    });

    it('returns null if there is no session', async () => {
      const vault = TestBed.inject(SessionVaultService);
      (vault.getValue as jasmine.Spy).withArgs('session').and.returnValue(Promise.resolve(null));
      const token = await service.getAccessToken();
      expect(token).toBeUndefined();
    });
  });

  describe('is authenticated', () => {
    it('resolves true if there is a token', async () => {
      const vault = TestBed.inject(SessionVaultService);
      (vault.getValue as jasmine.Spy).withArgs('session').and.returnValue(
        Promise.resolve({
          token: '484w9501c93kf00399sg',
          user: {
            id: 42,
            firstName: 'Douglas',
            lastName: 'Adams',
            email: 'thank.you@forthefish.com',
          },
        }),
      );
      expect(await service.isAuthenticated()).toEqual(true);
    });

    it('resolves false if there is no token', async () => {
      const vault = TestBed.inject(SessionVaultService);
      (vault.getValue as jasmine.Spy).withArgs('session').and.returnValue(null);
      expect(await service.isAuthenticated()).toEqual(false);
    });
  });
});

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Session } from '@app/models';
import { environment } from '@env/environment';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let httpTestingController: HttpTestingController;
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('POSTs the login', () => {
      service.login('thank.you@forthefish.com', 'solongDude').subscribe();
      const req = httpTestingController.expectOne(`${environment.dataService}/login`);
      expect(req.request.method).toEqual('POST');
      req.flush({});
      httpTestingController.verify();
    });

    it('passes the credentials in the body', () => {
      service.login('thank.you@forthefish.com', 'solongDude').subscribe();
      const req = httpTestingController.expectOne(`${environment.dataService}/login`);
      expect(req.request.body).toEqual({
        username: 'thank.you@forthefish.com',
        password: 'solongDude',
      });
      req.flush({});
      httpTestingController.verify();
    });

    describe('on success', () => {
      let response: any;
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

      it('emits the session', fakeAsync(() => {
        let session: Session | undefined;
        service.login('thank.you@forthefish.com', 'solongDude').subscribe((r) => (session = r));
        const req = httpTestingController.expectOne(`${environment.dataService}/login`);
        req.flush(response);
        tick();
        httpTestingController.verify();
        expect(session).toEqual({
          token: '48499501093kf00399sg',
          user: {
            id: 42,
            firstName: 'Douglas',
            lastName: 'Adams',
            email: 'thank.you@forthefish.com',
          },
        });
      }));
    });

    describe('on failure', () => {
      let response: any;
      beforeEach(() => {
        response = { success: false };
      });

      it('emits undefined', fakeAsync(() => {
        service.login('thank.you@forthefish.com', 'solongDude').subscribe((r) => expect(r).toEqual(undefined));
        const req = httpTestingController.expectOne(`${environment.dataService}/login`);
        req.flush(response);
        tick();
        httpTestingController.verify();
      }));
    });
  });

  describe('logout', () => {
    it('POSTs the logout', () => {
      service.logout().subscribe();
      const req = httpTestingController.expectOne(`${environment.dataService}/logout`);
      req.flush({});
      httpTestingController.verify();
      expect(true).toBe(true); // Prevents Jasmine warning
    });
  });
});

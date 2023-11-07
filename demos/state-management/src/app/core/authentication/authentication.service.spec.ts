import { TestBed } from '@angular/core/testing';
import { AuthConnect } from '@ionic-enterprise/auth';
import { SessionVaultService } from '../session-vault/session-vault.service';
import { createSessionVaultServiceMock } from '../session-vault/session-vault.service.mock';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    spyOn(AuthConnect, 'setup').and.callFake(() => Promise.resolve());
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SessionVaultService,
          useFactory: createSessionVaultServiceMock,
        },
      ],
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

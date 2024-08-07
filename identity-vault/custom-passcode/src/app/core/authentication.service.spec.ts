import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { SessionVaultService } from './session-vault.service';
import { createSessionVaultServiceMock } from './session-vault.service.mock';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../authentication.service';
import { createAuthenticationServiceMock } from '../authentication.service.mock';
import { authInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  beforeEach(() => TestBed.overrideProvider(AuthenticationService, { useFactory: createAuthenticationServiceMock }));

  it('should exist', () => {
    expect(authInterceptor).toBeTruthy();
  });
});

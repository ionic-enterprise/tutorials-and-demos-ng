import { TestBed } from '@angular/core/testing';
import { unauthInterceptor } from './unauth.interceptor';
import { SessionService } from '../session.service';
import { createSessionServiceMock } from '../session.service.mock';
import { NavController } from '@ionic/angular/standalone';
import { createAuthenticationServiceMock } from '../authentication.service.mock';

describe('UnauthInterceptor', () => {
  beforeEach(() =>
    TestBed.overrideProvider(SessionService, { useFactory: createSessionServiceMock }).overrideProvider(NavController, {
      useFactory: createAuthenticationServiceMock,
    }),
  );

  it('should be created', () => {
    expect(unauthInterceptor).toBeTruthy();
  });
});

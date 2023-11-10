import { TestBed, inject } from '@angular/core/testing';
import { AuthenticationExpediterService } from '@app/core';
import { createAuthenticationExpediterServiceMock } from '@app/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { createNavControllerMock } from '@test/mocks';
import { AuthGuardService } from './auth-guard.service';

describe('AuthGuardService', () => {
  beforeEach(() => {
    TestBed.overrideProvider(AuthenticationExpediterService, {
      useFactory: createAuthenticationExpediterServiceMock,
    }).overrideProvider(NavController, { useFactory: createNavControllerMock });
  });

  it('exists', inject([AuthGuardService], (guard: AuthGuardService) => {
    expect(guard).toBeTruthy();
  }));

  describe('canActivate', () => {
    let guard: AuthGuardService;
    let authenticationService: AuthenticationExpediterService;
    beforeEach(() => {
      guard = TestBed.inject(AuthGuardService);
      authenticationService = TestBed.inject(AuthenticationExpediterService);
    });

    describe('when the user is authenticated', () => {
      beforeEach(() => {
        (authenticationService.isAuthenticated as jasmine.Spy).and.returnValue(Promise.resolve(true));
      });

      it('resolves to true', async () => {
        expect(await guard.canActivate()).toEqual(true);
      });

      it('does not navigate', async () => {
        const navController = TestBed.inject(NavController);
        await guard.canActivate();
        expect(navController.navigateRoot).not.toHaveBeenCalled();
      });
    });

    describe('when the user is not authenticated', () => {
      beforeEach(() => {
        (authenticationService.isAuthenticated as jasmine.Spy).and.returnValue(Promise.resolve(false));
      });

      it('resolves to false', async () => {
        expect(await guard.canActivate()).toEqual(false);
      });

      it('navigates to login', async () => {
        const navController = TestBed.inject(NavController);
        await guard.canActivate();
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith('/login');
      });
    });
  });
});

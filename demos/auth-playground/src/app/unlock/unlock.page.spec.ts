import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthenticationExpediterService, SessionVaultService } from '@app/core';
import { createAuthenticationExpediterServiceMock, createSessionVaultServiceMock } from '@app/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { createNavControllerMock } from '@test/mocks';
import { click } from '@test/util';
import { UnlockPage } from './unlock.page';

describe('UnlockPage', () => {
  let component: UnlockPage;
  let fixture: ComponentFixture<UnlockPage>;

  beforeEach(() => {
    TestBed.overrideProvider(AuthenticationExpediterService, { useFactory: createAuthenticationExpediterServiceMock })
      .overrideProvider(NavController, { useFactory: createNavControllerMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });

    fixture = TestBed.createComponent(UnlockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('the unlock button', () => {
    describe('while the user can still unlock', () => {
      beforeEach(() => {
        const sessionVault = TestBed.inject(SessionVaultService);
        (sessionVault.canUnlock as jasmine.Spy).and.resolveTo(true);
      });

      it('unlocks the vault', fakeAsync(() => {
        const sessionVault = TestBed.inject(SessionVaultService);
        const button = fixture.debugElement.query(By.css('[data-testid="unlock-button"]'));
        click(fixture, button.nativeElement);
        tick();
        expect(sessionVault.unlock).toHaveBeenCalledTimes(1);
      }));

      it('navigates to the root', fakeAsync(() => {
        const navController = TestBed.inject(NavController);
        const button = fixture.debugElement.query(By.css('[data-testid="unlock-button"]'));
        click(fixture, button.nativeElement);
        tick();
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith(['/']);
      }));

      describe('when the user cancels', () => {
        it('does not navigate', fakeAsync(() => {
          const navController = TestBed.inject(NavController);
          const sessionVault = TestBed.inject(SessionVaultService);
          (sessionVault.unlock as jasmine.Spy).and.rejectWith(new Error('whatever, dude'));
          const button = fixture.debugElement.query(By.css('[data-testid="unlock-button"]'));
          click(fixture, button.nativeElement);
          tick();
          expect(navController.navigateRoot).not.toHaveBeenCalled();
        }));
      });
    });

    describe('once the user can no longer unlock', () => {
      beforeEach(() => {
        const sessionVault = TestBed.inject(SessionVaultService);
        (sessionVault.canUnlock as jasmine.Spy).and.resolveTo(false);
      });

      it('does not unlock the vault', fakeAsync(() => {
        const sessionVault = TestBed.inject(SessionVaultService);
        const button = fixture.debugElement.query(By.css('[data-testid="unlock-button"]'));
        click(fixture, button.nativeElement);
        tick();
        expect(sessionVault.unlock).not.toHaveBeenCalled();
      }));

      it('navigates to the login page', fakeAsync(() => {
        const navController = TestBed.inject(NavController);
        const button = fixture.debugElement.query(By.css('[data-testid="unlock-button"]'));
        click(fixture, button.nativeElement);
        tick();
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith(['/', 'login']);
      }));
    });
  });

  describe('the redo button', () => {
    it('clears the vault', fakeAsync(() => {
      const session = TestBed.inject(SessionVaultService);
      const button = fixture.debugElement.query(By.css('[data-testid="redo-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(session.clear).toHaveBeenCalledTimes(1);
    }));

    it('performs a logout', fakeAsync(() => {
      const auth = TestBed.inject(AuthenticationExpediterService);
      const button = fixture.debugElement.query(By.css('[data-testid="redo-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(auth.logout).toHaveBeenCalledTimes(1);
    }));

    it('navigates to the login page', fakeAsync(() => {
      const navController = TestBed.inject(NavController);
      const button = fixture.debugElement.query(By.css('[data-testid="redo-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navController.navigateRoot).toHaveBeenCalledWith(['/', 'login']);
    }));
  });
});

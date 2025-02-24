import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SessionVaultService } from '@app/core';
import { createSessionVaultServiceMock } from '@app/core/testing';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular/standalone';
import { createNavControllerMock } from '@test/mocks';
import { StartPage } from './start.page';

describe('StartPage', () => {
  let component: StartPage;
  let fixture: ComponentFixture<StartPage>;

  beforeEach(() => {
    TestBed.overrideProvider(NavController, { useFactory: createNavControllerMock }).overrideProvider(
      SessionVaultService,
      { useFactory: createSessionVaultServiceMock },
    );

    fixture = TestBed.createComponent(StartPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    describe('when the vault is locked', () => {
      beforeEach(() => {
        const sessionVault = TestBed.inject(SessionVaultService);
        (sessionVault.canUnlock as jasmine.Spy).and.returnValue(Promise.resolve(true));
      });

      describe('on mobile', () => {
        beforeEach(() => {
          spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);
        });

        it('navigates to the unlock page', fakeAsync(() => {
          const navController = TestBed.inject(NavController);
          fixture.detectChanges();
          tick();
          expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
          expect(navController.navigateRoot).toHaveBeenCalledWith(['/', 'unlock']);
        }));
      });

      describe('on web', () => {
        beforeEach(() => {
          spyOn(Capacitor, 'isNativePlatform').and.returnValue(false);
        });

        it('navigates to the tea list', fakeAsync(() => {
          const navController = TestBed.inject(NavController);
          fixture.detectChanges();
          tick();
          expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
          expect(navController.navigateRoot).toHaveBeenCalledWith(['/', 'tabs', 'tea-list']);
        }));
      });
    });

    describe('when the vault is unlocked', () => {
      beforeEach(() => {
        const sessionVault = TestBed.inject(SessionVaultService);
        (sessionVault.canUnlock as jasmine.Spy).and.returnValue(Promise.resolve(false));
      });

      describe('on mobile', () => {
        beforeEach(() => {
          spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);
        });

        it('navigates to the tea list page', fakeAsync(() => {
          const navController = TestBed.inject(NavController);
          fixture.detectChanges();
          tick();
          expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
          expect(navController.navigateRoot).toHaveBeenCalledWith(['/', 'tabs', 'tea-list']);
        }));
      });

      describe('on web', () => {
        beforeEach(() => {
          spyOn(Capacitor, 'isNativePlatform').and.returnValue(false);
        });

        it('navigates to the tea list', fakeAsync(() => {
          const navController = TestBed.inject(NavController);
          fixture.detectChanges();
          tick();
          expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
          expect(navController.navigateRoot).toHaveBeenCalledWith(['/', 'tabs', 'tea-list']);
        }));
      });
    });
  });
});

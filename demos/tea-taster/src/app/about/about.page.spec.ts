import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { createAuthenticationServiceMock, createSessionVaultServiceMock } from '@app/core/testing';
import { NavController } from '@ionic/angular';
import { createNavControllerMock } from '@test/mocks';
import { of } from 'rxjs';

import { AboutPage } from './about.page';

describe('AboutPage', () => {
  let component: AboutPage;
  let fixture: ComponentFixture<AboutPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AboutPage],
    })
      .overrideProvider(AuthenticationService, { useFactory: createAuthenticationServiceMock })
      .overrideProvider(NavController, { useFactory: createNavControllerMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock })
      .compileComponents();

    fixture = TestBed.createComponent(AboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout button', () => {
    describe('on click', () => {
      beforeEach(() => {
        const auth = TestBed.inject(AuthenticationService);
        (auth.logout as jasmine.Spy).and.returnValue(of(undefined));
      });

      it('calls the logout', () => {
        const auth = TestBed.inject(AuthenticationService);
        const button = fixture.debugElement.query(By.css('[data-testid="logout-button"]')).nativeElement;
        click(button);
        expect(auth.logout).toHaveBeenCalledTimes(1);
      });

      it('clears the session', () => {
        const button = fixture.debugElement.query(By.css('[data-testid="logout-button"]')).nativeElement;
        const sessionVault = TestBed.inject(SessionVaultService);
        click(button);
        expect(sessionVault.clear).toHaveBeenCalledTimes(1);
      });

      it('navigates to the login page', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="logout-button"]')).nativeElement;
        const nav = TestBed.inject(NavController);
        click(button);
        tick();
        expect(nav.navigateRoot).toHaveBeenCalledTimes(1);
        expect(nav.navigateRoot).toHaveBeenCalledWith(['/', 'login']);
      }));
    });
  });

  const click = (button: HTMLElement) => {
    const event = new Event('click');
    button.dispatchEvent(event);
    fixture.detectChanges();
  };
});

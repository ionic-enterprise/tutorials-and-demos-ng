import { createAuthenticationServiceMock } from './../core/authentication.service.mock';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Tab1Page } from './tab1.page';
import { AuthenticationService } from '../core/authentication.service';
import { By } from '@angular/platform-browser';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Tab1Page],
    })
      .overrideProvider(AuthenticationService, { useFactory: createAuthenticationServiceMock })
      .compileComponents();
    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checks the current auth status', () => {
    fixture.detectChanges();
    const auth = TestBed.inject(AuthenticationService);
    expect(auth.isAuthenticated).toHaveBeenCalledTimes(1);
  });

  describe('login button', () => {
    describe('when logged in', () => {
      beforeEach(fakeAsync(() => {
        const auth = TestBed.inject(AuthenticationService);
        (auth.isAuthenticated as jasmine.Spy).and.resolveTo(true);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }));

      it('is not rendered', () => {
        expect(fixture.debugElement.query(By.css('[data-testid="login-button"'))).toBeFalsy();
      });
    });

    describe('when not logged in', () => {
      beforeEach(fakeAsync(() => {
        const auth = TestBed.inject(AuthenticationService);
        (auth.isAuthenticated as jasmine.Spy).and.resolveTo(false);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }));

      it('performs a login', fakeAsync(() => {
        const auth = TestBed.inject(AuthenticationService);
        const button = fixture.debugElement.query(By.css('[data-testid="login-button"'));
        click(button.nativeElement);
        tick();
        expect(auth.login).toHaveBeenCalledTimes(1);
      }));

      it('checks the auth again', fakeAsync(() => {
        const auth = TestBed.inject(AuthenticationService);
        const button = fixture.debugElement.query(By.css('[data-testid="login-button"'));
        click(button.nativeElement);
        tick();
        expect(auth.isAuthenticated).toHaveBeenCalledTimes(2);
      }));
    });
  });

  describe('logout button', () => {
    describe('when not logged in', () => {
      beforeEach(fakeAsync(() => {
        const auth = TestBed.inject(AuthenticationService);
        (auth.isAuthenticated as jasmine.Spy).and.resolveTo(false);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }));

      it('is not rendered', () => {
        expect(fixture.debugElement.query(By.css('[data-testid="logout-button"'))).toBeFalsy();
      });
    });

    describe('when logged in', () => {
      beforeEach(fakeAsync(() => {
        const auth = TestBed.inject(AuthenticationService);
        (auth.isAuthenticated as jasmine.Spy).and.resolveTo(true);
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
      }));

      it('performs a login', fakeAsync(() => {
        const auth = TestBed.inject(AuthenticationService);
        const button = fixture.debugElement.query(By.css('[data-testid="logout-button"'));
        click(button.nativeElement);
        tick();
        expect(auth.logout).toHaveBeenCalledTimes(1);
      }));

      it('checks the auth again', fakeAsync(() => {
        const auth = TestBed.inject(AuthenticationService);
        const button = fixture.debugElement.query(By.css('[data-testid="logout-button"'));
        click(button.nativeElement);
        tick();
        expect(auth.isAuthenticated).toHaveBeenCalledTimes(2);
      }));
    });
  });

  const click = (button: HTMLElement) => {
    const event = new Event('click');
    button.dispatchEvent(event);
    fixture.detectChanges();
  };
});

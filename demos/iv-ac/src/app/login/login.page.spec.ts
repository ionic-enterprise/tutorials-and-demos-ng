import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthenticationService } from '@app/core';
import { NavController } from '@ionic/angular';
import { createNavControllerMock } from '@test/mocks';
import { of } from 'rxjs';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LoginPage],
    })
      .overrideProvider(NavController, { useFactory: createNavControllerMock })
      .compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('has the proper title', () => {
    const titles = fixture.debugElement.queryAll(By.css('ion-title'));
    expect(titles.length).toBe(1);
    expect(titles[0].nativeElement.textContent.trim()).toBe('Login');
  });

  describe('signin button', () => {
    let button: HTMLIonButtonElement;

    beforeEach(() => {
      button = fixture.nativeElement.querySelector('ion-button');
    });

    describe('on click', () => {
      let auth: AuthenticationService;

      beforeEach(() => {
        const session = {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          idToken: 'test-id-token',
        };

        auth = TestBed.inject(AuthenticationService);
        spyOn(auth, 'login').and.returnValue(Promise.resolve());
      });

      it('calls the login', () => {
        click(button);
        expect(auth.login).toHaveBeenCalledTimes(1);
      });

      describe('on success', () => {
        const session: any = {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          idToken: 'test-id-token',
        };

        beforeEach(() => {
          (auth.login as jasmine.Spy).and.returnValue(of(session));
        });

        it('navigates to the main page', fakeAsync(() => {
          const nav = TestBed.inject(NavController);
          click(button);
          tick();
          expect(nav.navigateRoot).toHaveBeenCalledTimes(1);
          expect(nav.navigateRoot).toHaveBeenCalledWith(['/']);
        }));
      });
    });
  });

  const click = (button: HTMLElement) => {
    const event = new Event('click');
    button.dispatchEvent(event);
    fixture.detectChanges();
  };
});

import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthenticationExpediterService, SessionVaultService } from '@app/core';
import { createAuthenticationExpediterServiceMock, createSessionVaultServiceMock } from '@app/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { createNavControllerMock } from '@test/mocks';
import { click, setInputValue } from '@test/util';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(waitForAsync(() => {
    spyOn(console, 'error').and.callFake(() => null);
    TestBed.overrideProvider(AuthenticationExpediterService, { useFactory: createAuthenticationExpediterServiceMock })
      .overrideProvider(NavController, { useFactory: createNavControllerMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('basic signin button', () => {
    let button: HTMLIonButtonElement;
    let email: HTMLIonInputElement;
    let password: HTMLIonInputElement;
    beforeEach(fakeAsync(() => {
      button = fixture.nativeElement.querySelector('[data-testid="basic-signin-button"]');
      email = fixture.nativeElement.querySelector('#email-input');
      password = fixture.nativeElement.querySelector('#password-input');
      fixture.detectChanges();
      tick();
    }));

    it('starts disabled', () => {
      expect(button.disabled).toEqual(true);
    });

    it('is disabled with just an email address', () => {
      setInputValue(fixture, email, 'test@test.com');
      expect(button.disabled).toEqual(true);
    });

    it('is disabled with just a password', () => {
      setInputValue(fixture, password, 'ThisI$MyPassw0rd');
      expect(button.disabled).toEqual(true);
    });

    it('is enabled with both an email address and a password', () => {
      setInputValue(fixture, email, 'test@test.com');
      setInputValue(fixture, password, 'ThisI$MyPassw0rd');
      expect(button.disabled).toEqual(false);
    });

    it('is disabled when the email address is not a valid format', () => {
      setInputValue(fixture, email, 'testtest.com');
      setInputValue(fixture, password, 'ThisI$MyPassw0rd');
      expect(button.disabled).toEqual(true);
    });
  });

  describe('error messages', () => {
    let errorDiv: HTMLDivElement;
    let email: HTMLIonInputElement;
    let password: HTMLIonInputElement;
    beforeEach(fakeAsync(() => {
      errorDiv = fixture.nativeElement.querySelector('[data-testid="login-form-errors"]');
      email = fixture.nativeElement.querySelector('#email-input');
      password = fixture.nativeElement.querySelector('#password-input');
      fixture.detectChanges();
      tick();
    }));

    it('starts with no error message', () => {
      expect(errorDiv.textContent).toEqual('');
    });

    it('displays an error message if the e-mail address is dirty and empty', () => {
      setInputValue(fixture, email, 'test@test.com');
      setInputValue(fixture, email, '');
      expect(errorDiv.textContent?.trim()).toEqual('E-Mail Address is required');
    });

    it('displays an error message if the e-mail address has an invalid format', () => {
      setInputValue(fixture, email, 'testtest.com');
      expect(errorDiv.textContent?.trim()).toEqual('E-Mail Address must have a valid format');
    });

    it('clears the error message when the e-mail address has a valid format', () => {
      setInputValue(fixture, email, 'test@test.com');
      expect(errorDiv.textContent?.trim()).toEqual('');
    });

    it('displays an error message if the password is dirty and empty', () => {
      setInputValue(fixture, password, 'thisisapassword');
      setInputValue(fixture, password, '');
      expect(errorDiv.textContent?.trim()).toEqual('Password is required');
    });
  });

  describe('clicking the Basic signin button', () => {
    beforeEach(() => {
      const email = fixture.nativeElement.querySelector('#email-input');
      const password = fixture.nativeElement.querySelector('#password-input');
      setInputValue(fixture, email, 'test@myhome.com');
      setInputValue(fixture, password, '$0upyPoopy');
    });

    it('initializes the vault to the default unlock mode', fakeAsync(() => {
      const vault = TestBed.inject(SessionVaultService);
      const button = fixture.debugElement.query(By.css('[data-testid="basic-signin-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(vault.initializeUnlockMode).toHaveBeenCalledTimes(1);
    }));

    it('calls login', fakeAsync(() => {
      const auth = TestBed.inject(AuthenticationExpediterService);
      const button = fixture.debugElement.query(By.css('[data-testid="basic-signin-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(auth.login).toHaveBeenCalledTimes(1);
      expect(auth.login).toHaveBeenCalledWith('Basic', { email: 'test@myhome.com', password: '$0upyPoopy' });
    }));

    describe('on success', () => {
      beforeEach(() => {
        component.errorMessage = 'I am in error';
        fixture.detectChanges();
      });

      it('clears the error message', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="basic-signin-button"]'));
        const msg = fixture.debugElement.query(By.css('[data-testid="error-message"]'));
        click(fixture, button.nativeElement);
        tick();
        fixture.detectChanges();
        expect(msg.nativeElement.textContent).toEqual('');
      }));

      it('navigates to the root', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="basic-signin-button"]'));
        click(fixture, button.nativeElement);
        tick();
        const navController = TestBed.inject(NavController);
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith(['/']);
      }));
    });

    describe('on failure', () => {
      beforeEach(() => {
        const auth = TestBed.inject(AuthenticationExpediterService);
        (auth.login as jasmine.Spy).and.returnValue(Promise.reject(new Error('this shall not be')));
      });

      it('display a generic error message', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="basic-signin-button"]'));
        const msg = fixture.debugElement.query(By.css('[data-testid="error-message"]'));
        click(fixture, button.nativeElement);
        tick();
        fixture.detectChanges();
        expect(msg.nativeElement.textContent).toEqual('Login failed. Please try again.');
      }));

      it('does not navigate', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="basic-signin-button"]'));
        click(fixture, button.nativeElement);
        tick();
        const navController = TestBed.inject(NavController);
        expect(navController.navigateRoot).not.toHaveBeenCalled();
      }));
    });
  });

  describe('clicking the AWS signin button', () => {
    it('initializes the vault to the default unlock mode', fakeAsync(() => {
      const vault = TestBed.inject(SessionVaultService);
      const button = fixture.debugElement.query(By.css('[data-testid="aws-signin-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(vault.initializeUnlockMode).toHaveBeenCalledTimes(1);
    }));

    it('calls login', fakeAsync(() => {
      const auth = TestBed.inject(AuthenticationExpediterService);
      const button = fixture.debugElement.query(By.css('[data-testid="aws-signin-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(auth.login).toHaveBeenCalledTimes(1);
      expect(auth.login).toHaveBeenCalledWith('AWS');
    }));

    describe('on success', () => {
      beforeEach(() => {
        component.errorMessage = 'I am in error';
        fixture.detectChanges();
      });

      it('clears the error message', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="aws-signin-button"]'));
        const msg = fixture.debugElement.query(By.css('[data-testid="error-message"]'));
        click(fixture, button.nativeElement);
        tick();
        fixture.detectChanges();
        expect(msg.nativeElement.textContent).toEqual('');
      }));

      it('navigates to the root', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="aws-signin-button"]'));
        click(fixture, button.nativeElement);
        tick();
        const navController = TestBed.inject(NavController);
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith(['/']);
      }));
    });

    describe('on failure', () => {
      beforeEach(() => {
        const auth = TestBed.inject(AuthenticationExpediterService);
        (auth.login as jasmine.Spy).and.returnValue(Promise.reject(new Error('this shall not be')));
      });

      it('display a generic error message', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="aws-signin-button"]'));
        const msg = fixture.debugElement.query(By.css('[data-testid="error-message"]'));
        click(fixture, button.nativeElement);
        tick();
        fixture.detectChanges();
        expect(msg.nativeElement.textContent).toEqual('Login failed. Please try again.');
      }));

      it('does not navigate', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="aws-signin-button"]'));
        click(fixture, button.nativeElement);
        tick();
        const navController = TestBed.inject(NavController);
        expect(navController.navigateRoot).not.toHaveBeenCalled();
      }));
    });
  });

  describe('clicking the Azure signin button', () => {
    it('initializes the vault to the default unlock mode', fakeAsync(() => {
      const vault = TestBed.inject(SessionVaultService);
      const button = fixture.debugElement.query(By.css('[data-testid="azure-signin-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(vault.initializeUnlockMode).toHaveBeenCalledTimes(1);
    }));

    it('calls login', fakeAsync(() => {
      const auth = TestBed.inject(AuthenticationExpediterService);
      const button = fixture.debugElement.query(By.css('[data-testid="azure-signin-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(auth.login).toHaveBeenCalledTimes(1);
      expect(auth.login).toHaveBeenCalledWith('Azure');
    }));

    describe('on success', () => {
      beforeEach(() => {
        component.errorMessage = 'I am in error';
        fixture.detectChanges();
      });

      it('clears the error message', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="azure-signin-button"]'));
        const msg = fixture.debugElement.query(By.css('[data-testid="error-message"]'));
        click(fixture, button.nativeElement);
        tick();
        fixture.detectChanges();
        expect(msg.nativeElement.textContent).toEqual('');
      }));

      it('navigates to the root', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="azure-signin-button"]'));
        click(fixture, button.nativeElement);
        tick();
        const navController = TestBed.inject(NavController);
        expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
        expect(navController.navigateRoot).toHaveBeenCalledWith(['/']);
      }));
    });

    describe('on failure', () => {
      beforeEach(() => {
        const auth = TestBed.inject(AuthenticationExpediterService);
        (auth.login as jasmine.Spy).and.returnValue(Promise.reject(new Error('this shall not be')));
      });

      it('display a generic error message', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="azure-signin-button"]'));
        const msg = fixture.debugElement.query(By.css('[data-testid="error-message"]'));
        click(fixture, button.nativeElement);
        tick();
        fixture.detectChanges();
        expect(msg.nativeElement.textContent).toEqual('Login failed. Please try again.');
      }));

      it('does not navigate', fakeAsync(() => {
        const button = fixture.debugElement.query(By.css('[data-testid="azure-signin-button"]'));
        click(fixture, button.nativeElement);
        tick();
        const navController = TestBed.inject(NavController);
        expect(navController.navigateRoot).not.toHaveBeenCalled();
      }));
    });
  });
});

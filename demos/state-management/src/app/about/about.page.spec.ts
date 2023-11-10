import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuthenticationService } from '@app/core';
import { createAuthenticationServiceMock } from '@app/core/testing';
import { logout } from '@app/store/actions';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { AboutPage } from './about.page';

describe('AboutPage', () => {
  let component: AboutPage;
  let fixture: ComponentFixture<AboutPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    }).overrideProvider(AuthenticationService, { useFactory: createAuthenticationServiceMock });

    fixture = TestBed.createComponent(AboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logout button', () => {
    it('dispatches the logout button', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="logout-button"]'));
      const store = TestBed.inject(Store);
      spyOn(store, 'dispatch');
      click(button.nativeElement);
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
  });

  const click = (button: HTMLElement) => {
    const event = new Event('click');
    button.dispatchEvent(event);
    fixture.detectChanges();
  };
});

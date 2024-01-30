import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { createNavControllerMock } from 'test/mocks';
import { AuthenticationService } from '../core/authentication.service';
import { createAuthenticationServiceMock } from '../core/authentication.service.mock';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(() => {
    TestBed.overrideProvider(NavController, { useFactory: createNavControllerMock }).overrideProvider(
      AuthenticationService,
      { useFactory: createAuthenticationServiceMock },
    );
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { createAuthenticationServiceMock, createSessionVaultServiceMock } from '@app/core/testing';
import { NavController } from '@ionic/angular';
import { createNavControllerMock } from '@test/mocks';

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

  const click = (button: HTMLElement) => {
    const event = new Event('click');
    button.dispatchEvent(event);
    fixture.detectChanges();
  };
});

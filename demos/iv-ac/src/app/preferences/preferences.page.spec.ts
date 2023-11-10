import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { createAuthenticationServiceMock, createSessionVaultServiceMock } from '@app/core/testing';
import { ModalController, NavController } from '@ionic/angular/standalone';
import { createNavControllerMock, createOverlayControllerMock } from '@test/mocks';
import { PreferencesPage } from './preferences.page';

describe('PreferencesPage', () => {
  let component: PreferencesPage;
  let fixture: ComponentFixture<PreferencesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(AuthenticationService, { useFactory: createAuthenticationServiceMock })
      .overrideProvider(ModalController, { useFactory: () => createOverlayControllerMock('ModalController') })
      .overrideProvider(NavController, { useFactory: createNavControllerMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });

    fixture = TestBed.createComponent(PreferencesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

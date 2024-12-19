import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { createAuthenticationServiceMock, createSessionVaultServiceMock } from '@app/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { createNavControllerMock } from '@test/mocks';
import { UnlockPage } from './unlock.page';

describe('UnlockPage', () => {
  let component: UnlockPage;
  let fixture: ComponentFixture<UnlockPage>;

  beforeEach(waitForAsync(() => {
    spyOn(console, 'error').and.callFake(() => null);
    TestBed.overrideProvider(AuthenticationService, { useFactory: createAuthenticationServiceMock })
      .overrideProvider(NavController, { useFactory: createNavControllerMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });

    fixture = TestBed.createComponent(UnlockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

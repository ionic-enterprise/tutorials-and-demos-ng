import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { NavController } from '@ionic/angular/standalone';
import { createNavControllerMock } from '@test/mocks';
import { AppComponent } from './app.component';
import { PreferencesService, SessionVaultService } from './core';
import { createPreferencesServiceMock, createSessionVaultServiceMock } from './core/testing';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.overrideComponent(AppComponent, {
      add: {
        imports: [RouterTestingModule],
      },
    })
      .overrideProvider(NavController, { useFactory: createNavControllerMock })
      .overrideProvider(PreferencesService, { useFactory: createPreferencesServiceMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('set the privacy screen', () => {
    spyOn(PrivacyScreen, 'enable');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(PrivacyScreen.enable).toHaveBeenCalledTimes(1);
  });
});

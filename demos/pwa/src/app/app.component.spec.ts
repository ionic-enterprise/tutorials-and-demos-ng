import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform } from '@ionic/angular';
import { AppComponent } from './app.component';
import { ApplicationService, SessionVaultService } from './core';
import { createApplicationServiceMock, createSessionVaultServiceMock } from './core/testing';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    })
      .overrideProvider(ApplicationService, { useFactory: createApplicationServiceMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('hides the splash screen', () => {
    spyOn(SplashScreen, 'hide');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(SplashScreen.hide).toHaveBeenCalledTimes(1);
  });

  describe('in a hybrid mobile context', () => {
    beforeEach(() => {
      const platform = TestBed.inject(Platform);
      spyOn(platform, 'is').withArgs('hybrid').and.returnValue(true);
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
    });

    it('registers for updates', () => {
      const application = TestBed.inject(ApplicationService);
      expect(application.registerForUpdates).not.toHaveBeenCalled();
    });
  });

  describe('in a web context', () => {
    beforeEach(() => {
      const platform = TestBed.inject(Platform);
      spyOn(platform, 'is').withArgs('hybrid').and.returnValue(false);
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
    });

    it('registers for updates', () => {
      const application = TestBed.inject(ApplicationService);
      TestBed.createComponent(AppComponent);
      expect(application.registerForUpdates).toHaveBeenCalledTimes(1);
    });
  });
});

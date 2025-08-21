import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Capacitor } from '@capacitor/core';
import { AppComponent } from './app.component';
import { ApplicationService, SessionVaultService } from './core';
import { createApplicationServiceMock, createSessionVaultServiceMock } from './core/testing';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.overrideComponent(AppComponent, {
      add: { imports: [RouterTestingModule] },
    })
      .overrideProvider(ApplicationService, { useFactory: createApplicationServiceMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('in a hybrid mobile context', () => {
    beforeEach(() => {
      spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);
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
      spyOn(Capacitor, 'isNativePlatform').and.returnValue(false);
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

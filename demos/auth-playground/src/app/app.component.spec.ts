import { TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavController } from '@ionic/angular';
import { createNavControllerMock } from '@test/mocks';
import { AppComponent } from './app.component';
import { SessionVaultService } from './core';
import { createSessionVaultServiceMock } from './core/testing';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    })
      .overrideProvider(NavController, { useFactory: createNavControllerMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock })
      .compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});

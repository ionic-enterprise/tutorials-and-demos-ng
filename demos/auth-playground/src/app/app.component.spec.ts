import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavController } from '@ionic/angular/standalone';
import { createNavControllerMock } from '@test/mocks';
import { AppComponent } from './app.component';
import { SessionVaultService } from './core';
import { createSessionVaultServiceMock } from './core/testing';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.overrideComponent(AppComponent, {
      add: { imports: [RouterTestingModule] },
    })
      .overrideProvider(NavController, { useFactory: createNavControllerMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});

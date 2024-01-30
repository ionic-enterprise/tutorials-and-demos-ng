import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SessionVaultService } from './core/session-vault.service';
import { createSessionVaultServiceMock } from './core/session-vault.service.mock';
import { NavController } from '@ionic/angular';
import { createNavControllerMock } from 'test/mocks';

describe('AppComponent', () => {
  it('should create the app', () => {
    TestBed.overrideComponent(AppComponent, {
      add: {
        imports: [RouterTestingModule],
      },
    })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock })
      .overrideProvider(NavController, { useFactory: createNavControllerMock });
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

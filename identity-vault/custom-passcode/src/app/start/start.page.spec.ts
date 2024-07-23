import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { createNavControllerMock } from 'test/mocks';
import { SessionVaultService } from '../core/session-vault.service';
import { createSessionVaultServiceMock } from '../core/session-vault.service.mock';
import { StartPage } from './start.page';

describe('StartPage', () => {
  let component: StartPage;
  let fixture: ComponentFixture<StartPage>;

  beforeEach(() => {
    TestBed.overrideProvider(NavController, { useFactory: createNavControllerMock }).overrideProvider(
      SessionVaultService,
      { useFactory: createSessionVaultServiceMock },
    );
    fixture = TestBed.createComponent(StartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

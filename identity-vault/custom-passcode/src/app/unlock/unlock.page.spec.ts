import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { createNavControllerMock } from 'test/mocks';
import { SessionVaultService } from '../core/session-vault.service';
import { createSessionVaultServiceMock } from '../core/session-vault.service.mock';
import { UnlockPage } from './unlock.page';

describe('UnlockPage', () => {
  let component: UnlockPage;
  let fixture: ComponentFixture<UnlockPage>;

  beforeEach(() => {
    TestBed.overrideProvider(NavController, { useFactory: createNavControllerMock }).overrideProvider(
      SessionVaultService,
      { useFactory: createSessionVaultServiceMock },
    );
    fixture = TestBed.createComponent(UnlockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

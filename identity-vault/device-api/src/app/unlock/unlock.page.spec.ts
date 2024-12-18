import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionVaultService } from '../core/session-vault.service';
import { createSessionVaultServiceMock } from '../core/session-vault.service.mock';
import { UnlockPage } from './unlock.page';

describe('UnlockPage', () => {
  let component: UnlockPage;
  let fixture: ComponentFixture<UnlockPage>;

  beforeEach(() => {
    TestBed.overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });
    fixture = TestBed.createComponent(UnlockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

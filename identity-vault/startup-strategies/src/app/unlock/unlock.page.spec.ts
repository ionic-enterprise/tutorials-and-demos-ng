import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnlockPage } from './unlock.page';
import { SessionVaultService } from '../core/session-vault.service';
import { createSessionVaultServiceMock } from '../core/session-vault.service.mock';

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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionVaultService } from '../core/session-vault.service';
import { createSessionVaultServiceMock } from '../core/session-vault.service.mock';
import { Tab1Page } from './tab1.page';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(async () => {
    TestBed.overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });
    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

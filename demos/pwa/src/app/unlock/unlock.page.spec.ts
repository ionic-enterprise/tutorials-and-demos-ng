import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SessionVaultService } from '@app/core';
import { createSessionVaultServiceMock } from '@app/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { createNavControllerMock } from '@test/mocks';

import { UnlockPage } from './unlock.page';

describe('UnlockPage', () => {
  let component: UnlockPage;
  let fixture: ComponentFixture<UnlockPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NavController, useFactory: createNavControllerMock },
        { provide: SessionVaultService, useFactory: createSessionVaultServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UnlockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

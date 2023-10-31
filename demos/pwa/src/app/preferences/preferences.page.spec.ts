import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SessionVaultService } from '@app/core';
import { createSessionVaultServiceMock } from '@app/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { createNavControllerMock } from '@test/mocks';

import { PreferencesPage } from './preferences.page';

describe('PreferencesPage', () => {
  let component: PreferencesPage;
  let fixture: ComponentFixture<PreferencesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: NavController, useFactory: createNavControllerMock },
        { provide: SessionVaultService, useFactory: createSessionVaultServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PreferencesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SessionVaultService } from '@app/core';
import { createSessionVaultServiceMock } from '@app/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { createNavControllerMock } from '@test/mocks';
import { StartPage } from './start.page';

describe('StartPage', () => {
  let component: StartPage;
  let fixture: ComponentFixture<StartPage>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(NavController, {
      useFactory: createNavControllerMock,
    }).overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock });

    fixture = TestBed.createComponent(StartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AboutPage } from './about.page';
import { ModalController } from '@ionic/angular';
import { createOverlayControllerMock } from '@test/mocks';

describe('AboutPage', () => {
  let component: AboutPage;
  let fixture: ComponentFixture<AboutPage>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(ModalController, { useFactory: () => createOverlayControllerMock('ModalController') });
    fixture = TestBed.createComponent(AboutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

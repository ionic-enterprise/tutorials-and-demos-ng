import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { createOverlayControllerMock } from 'test/mocks';
import { PinDialogComponent } from './pin-dialog.component';

describe('PinDialogComponent', () => {
  let component: PinDialogComponent;
  let fixture: ComponentFixture<PinDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(ModalController, {
      useFactory: () => createOverlayControllerMock('ModalController'),
    });
    fixture = TestBed.createComponent(PinDialogComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

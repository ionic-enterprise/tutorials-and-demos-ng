import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BiometricPermissionState,
  BiometricSecurityStrength,
  Device,
  SupportedBiometricType,
} from '@ionic-enterprise/identity-vault';
import { AlertController } from '@ionic/angular/standalone';
import { createOverlayControllerMock } from '@test/mocks';
import { click } from '@test/util';
import { DeviceInfoPage } from './device-info.page';

describe('DeviceInfoPage', () => {
  let component: DeviceInfoPage;
  let fixture: ComponentFixture<DeviceInfoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(AlertController, { useFactory: () => createOverlayControllerMock('AlertController') });

    fixture = TestBed.createComponent(DeviceInfoPage);
    component = fixture.componentInstance;

    spyOn(Device, 'getBiometricStrengthLevel').and.returnValue(Promise.resolve(BiometricSecurityStrength.Strong));
    spyOn(Device, 'hasSecureHardware').and.returnValue(Promise.resolve(true));
    spyOn(Device, 'isBiometricsAllowed').and.returnValue(Promise.resolve(BiometricPermissionState.Prompt));
    spyOn(Device, 'isBiometricsEnabled').and.returnValue(Promise.resolve(false));
    spyOn(Device, 'isBiometricsSupported').and.returnValue(Promise.resolve(true));
    spyOn(Device, 'isHideScreenOnBackgroundEnabled').and.returnValue(Promise.resolve(true));
    spyOn(Device, 'isLockedOutOfBiometrics').and.returnValue(Promise.resolve(false));
    spyOn(Device, 'isSystemPasscodeSet').and.returnValue(Promise.resolve(true));
    spyOn(Device, 'getAvailableHardware').and.returnValue(Promise.resolve([SupportedBiometricType.Face]));
    spyOn(Device, 'setHideScreenOnBackground').and.returnValue(Promise.resolve());

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('the privacy screen button', () => {
    it('toggles the privacy screen', fakeAsync(() => {
      const button = fixture.debugElement.query(By.css('[data-testid="toggle-privacy-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(Device.setHideScreenOnBackground).toHaveBeenCalledTimes(1);
      expect(Device.setHideScreenOnBackground).toHaveBeenCalledWith(false);
    }));

    it('resets the flag', fakeAsync(() => {
      (Device.isHideScreenOnBackgroundEnabled as jasmine.Spy).calls.reset();
      (Device.isHideScreenOnBackgroundEnabled as jasmine.Spy).and.returnValue(Promise.resolve(false));
      const button = fixture.debugElement.query(By.css('[data-testid="toggle-privacy-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(Device.isHideScreenOnBackgroundEnabled).toHaveBeenCalledTimes(1);
      expect(component.isPrivacyScreenEnabled).toEqual(false);
    }));
  });

  describe('show biometrics prompt button', () => {
    beforeEach(() => {
      spyOn(Device, 'showBiometricPrompt').and.returnValue(Promise.resolve());
    });

    it('shows the biometrics prompt', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="show-biometrics-button"]'));
      click(fixture, button.nativeElement);
      expect(Device.showBiometricPrompt).toHaveBeenCalledTimes(1);
    });

    it('informs the user if it worked', fakeAsync(() => {
      const alertController = TestBed.inject(AlertController);
      const button = fixture.debugElement.query(By.css('[data-testid="show-biometrics-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(alertController.create).toHaveBeenCalledTimes(1);
      expect(alertController.create).toHaveBeenCalledWith({
        header: 'Show Biometrics',
        subHeader: 'Success!!',
      });
    }));

    it('informs the user if it failed', fakeAsync(() => {
      (Device.showBiometricPrompt as jasmine.Spy).and.returnValue(Promise.reject(new Error('Cancel')));
      const alertController = TestBed.inject(AlertController);
      const button = fixture.debugElement.query(By.css('[data-testid="show-biometrics-button"]'));
      click(fixture, button.nativeElement);
      tick();
      expect(alertController.create).toHaveBeenCalledTimes(1);
      expect(alertController.create).toHaveBeenCalledWith({
        header: 'Show Biometrics',
        subHeader: 'Failed. User likely cancelled the operation.',
      });
    }));
  });
});

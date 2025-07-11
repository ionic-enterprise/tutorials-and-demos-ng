import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Capacitor } from '@capacitor/core';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { Device } from '@ionic-enterprise/identity-vault';
import {
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.page.html',
  styleUrls: ['./device-info.page.scss'],
  imports: [
    FormsModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonTitle,
    IonToolbar,
  ],
})
export class DeviceInfoPage implements OnInit {
  private alertController = inject(AlertController);

  biometricStrength = '';
  hasSecureHardware = false;
  canTogglePrivacyScreen = false;
  isBiometricsAllowed = '';
  isBiometricsEnabled = false;
  isBiometricsSupported = false;
  isPrivacyScreenEnabled = false;
  isLockedOutOfBiometrics = false;
  isSystemPasscodeSet = false;
  availableHardware: string[] = [];

  async ngOnInit() {
    this.biometricStrength = await Device.getBiometricStrengthLevel();
    this.hasSecureHardware = await Device.hasSecureHardware();
    this.isBiometricsAllowed = await Device.isBiometricsAllowed();
    this.isBiometricsEnabled = await Device.isBiometricsEnabled();
    this.isBiometricsSupported = await Device.isBiometricsSupported();
    const { enabled } = await PrivacyScreen.isEnabled();
    this.isPrivacyScreenEnabled = enabled;
    this.isLockedOutOfBiometrics = await Device.isLockedOutOfBiometrics();
    this.isSystemPasscodeSet = await Device.isSystemPasscodeSet();
    this.availableHardware = await Device.getAvailableHardware();
    this.canTogglePrivacyScreen = Capacitor.isNativePlatform();
  }

  async togglePrivacy() {
    if (this.isPrivacyScreenEnabled) {
      await PrivacyScreen.disable();
    } else {
      await PrivacyScreen.enable();
    }
    const { enabled } = await PrivacyScreen.isEnabled();
    this.isPrivacyScreenEnabled = enabled;
  }

  async showBiometricPrompt() {
    try {
      await Device.showBiometricPrompt({ iosBiometricsLocalizedReason: 'This is only a test' });
      this.displayBioResultAlert('Success!!');
    } catch {
      this.displayBioResultAlert('Failed. User likely cancelled the operation.');
    }
  }

  private async displayBioResultAlert(subHeader: string) {
    const alert = await this.alertController.create({
      header: 'Show Biometrics',
      subHeader,
    });
    alert.present();
  }
}

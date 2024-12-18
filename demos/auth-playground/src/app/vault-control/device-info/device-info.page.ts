import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  Platform,
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

  constructor(
    private alertController: AlertController,
    private platform: Platform,
  ) {}

  async ngOnInit() {
    this.biometricStrength = await Device.getBiometricStrengthLevel();
    this.hasSecureHardware = await Device.hasSecureHardware();
    this.isBiometricsAllowed = await Device.isBiometricsAllowed();
    this.isBiometricsEnabled = await Device.isBiometricsEnabled();
    this.isBiometricsSupported = await Device.isBiometricsSupported();
    this.isPrivacyScreenEnabled = await Device.isHideScreenOnBackgroundEnabled();
    this.isLockedOutOfBiometrics = await Device.isLockedOutOfBiometrics();
    this.isSystemPasscodeSet = await Device.isSystemPasscodeSet();
    this.availableHardware = await Device.getAvailableHardware();
    this.canTogglePrivacyScreen = this.platform.is('hybrid');
  }

  async togglePrivacy() {
    await Device.setHideScreenOnBackground(!this.isPrivacyScreenEnabled);
    this.isPrivacyScreenEnabled = await Device.isHideScreenOnBackgroundEnabled();
  }

  async showBiometricPrompt() {
    try {
      await Device.showBiometricPrompt({ iosBiometricsLocalizedReason: 'This is only a test' });
      this.displayBioResultAlert('Success!!');
    } catch (error) {
      console.error(error);
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

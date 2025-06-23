import { Component, OnInit } from '@angular/core';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { Device } from '@ionic-enterprise/identity-vault';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonNote, IonTitle, IonToolbar],
})
export class Tab2Page implements OnInit {
  hasSecureHardware = false;
  isBiometricsSupported = false;
  availableHardware: string[] = [];

  biometricStrengthLevel = '';
  isBiometricsAllowed = '';
  isBiometricsEnabled = false;
  isHideScreenOnBackgroundEnabled = false;
  isLockedOutOfBiometrics = false;
  isSystemPasscodeSet = false;

  async ngOnInit(): Promise<void> {
    this.hasSecureHardware = await Device.hasSecureHardware();
    this.isBiometricsSupported = await Device.isBiometricsSupported();
    this.availableHardware = await Device.getAvailableHardware();

    this.biometricStrengthLevel = await Device.getBiometricStrengthLevel();
    this.isBiometricsAllowed = await Device.isBiometricsAllowed();
    this.isBiometricsEnabled = await Device.isBiometricsEnabled();
    const { enabled } = await PrivacyScreen.isEnabled();
    this.isHideScreenOnBackgroundEnabled = enabled;
    this.isLockedOutOfBiometrics = await Device.isLockedOutOfBiometrics();
    this.isSystemPasscodeSet = await Device.isSystemPasscodeSet();
  }

  async toggleHideScreenOnBackground(): Promise<void> {
    if (this.isHideScreenOnBackgroundEnabled) {
      PrivacyScreen.disable();
    } else {
      PrivacyScreen.enable();
    }
    const { enabled } = await PrivacyScreen.isEnabled();
    this.isHideScreenOnBackgroundEnabled = enabled;
  }

  async showBiometricPrompt(): Promise<void> {
    try {
      await Device.showBiometricPrompt({
        iosBiometricsLocalizedReason: 'Just to show you how this works',
      });
    } catch (err: unknown) {
      alert(JSON.stringify(err));
    }
  }
}

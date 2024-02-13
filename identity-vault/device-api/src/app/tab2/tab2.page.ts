import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  standalone: true,
  imports: [
    CommonModule,
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
  ],
})
export class Tab2Page implements OnInit {
  hasSecureHardware: Boolean = false;
  isBiometricsSupported: Boolean = false;
  availableHardware: Array<string> = [];

  biometricStrengthLevel: string = '';
  isBiometricsAllowed: string = '';
  isBiometricsEnabled: boolean = false;
  isHideScreenOnBackgroundEnabled: boolean = false;
  isLockedOutOfBiometrics: boolean = false;
  isSystemPasscodeSet: boolean = false;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.hasSecureHardware = await Device.hasSecureHardware();
    this.isBiometricsSupported = await Device.isBiometricsSupported();
    this.availableHardware = await Device.getAvailableHardware();

    this.biometricStrengthLevel = await Device.getBiometricStrengthLevel();
    this.isBiometricsAllowed = await Device.isBiometricsAllowed();
    this.isBiometricsEnabled = await Device.isBiometricsEnabled();
    this.isHideScreenOnBackgroundEnabled = await Device.isHideScreenOnBackgroundEnabled();
    this.isLockedOutOfBiometrics = await Device.isLockedOutOfBiometrics();
    this.isSystemPasscodeSet = await Device.isSystemPasscodeSet();
  }

  async toggleHideScreenOnBackground(): Promise<void> {
    await Device.setHideScreenOnBackground(!this.isHideScreenOnBackgroundEnabled);
    this.isHideScreenOnBackgroundEnabled = await Device.isHideScreenOnBackgroundEnabled();
  }

  async showBiometricPrompt(): Promise<void> {
    try {
      await Device.showBiometricPrompt({
        iosBiometricsLocalizedReason: 'Just to show you how this works',
      });
    } catch (e) {
      // This is the most likely scenario
      alert('user cancelled biometrics prompt');
    }
  }
}

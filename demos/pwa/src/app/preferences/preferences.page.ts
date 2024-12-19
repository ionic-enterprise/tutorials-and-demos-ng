import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { ModalController, NavController } from '@ionic/angular/standalone';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonToggle,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonToggle,
    IonLabel,
  ],
})
export class PreferencesPage implements OnInit {
  hideInBackground = false;
  useBiometrics = false;
  useSystemPasscode = false;
  useCustomPasscode = false;
  disableBiometrics = false;
  disableCustomPasscode = false;
  disableHideInBackground = false;
  disableSystemPasscode = false;

  constructor(
    private auth: AuthenticationService,
    private modalController: ModalController,
    private navController: NavController,
    private session: SessionVaultService,
  ) {}

  ngOnInit() {
    this.init();
  }

  async init() {
    this.disableHideInBackground = !this.session.canHideContentsInBackground();
    this.disableBiometrics = !(await this.session.canUseBiometrics());
    this.disableCustomPasscode = !this.session.canUseCustomPasscode();
    this.disableSystemPasscode = !(await this.session.canUseSystemPasscode());

    this.hideInBackground = await this.session.isHidingContentsInBackground();

    const unlockMode = await this.session.getUnlockMode();

    this.useBiometrics = unlockMode === 'Biometrics' || unlockMode === 'BiometricsWithPasscode';
    this.useSystemPasscode = unlockMode === 'SystemPasscode' || unlockMode === 'BiometricsWithPasscode';
    this.useCustomPasscode = unlockMode === 'CustomPasscode';
  }

  cancel() {
    this.modalController.dismiss();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useBiometricsChanged(event: any) {
    this.useBiometrics = event.detail.checked;
    if (this.useBiometrics) {
      this.useCustomPasscode = false;
    }
    this.setVaultLockMode();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSystemPasscodeChanged(event: any) {
    this.useSystemPasscode = event.detail.checked;
    if (this.useSystemPasscode) {
      this.useCustomPasscode = false;
    }
    this.setVaultLockMode();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useCustomPasscodeChanged(event: any) {
    this.useCustomPasscode = event.detail.checked;
    if (this.useCustomPasscode) {
      this.useBiometrics = false;
      this.useSystemPasscode = false;
    }
    this.setVaultLockMode();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hideInBackgroundChanged(event: any) {
    this.hideInBackground = event.detail.checked;
    this.session.hideContentsInBackground(this.hideInBackground);
  }

  async logoutClicked() {
    await this.auth.logout();
    this.session.clear();
    this.session.setUnlockMode('SecureStorage');
    this.navController.navigateRoot('/login');
    this.modalController.dismiss();
  }

  private setVaultLockMode(): Promise<void> {
    if (this.useCustomPasscode) {
      return this.session.setUnlockMode('CustomPasscode');
    }
    if (this.useBiometrics && this.useSystemPasscode) {
      return this.session.setUnlockMode('BiometricsWithPasscode');
    }
    if (this.useBiometrics) {
      return this.session.setUnlockMode('Biometrics');
    }
    if (this.useSystemPasscode) {
      return this.session.setUnlockMode('SystemPasscode');
    }
    return this.session.setUnlockMode('SecureStorage');
  }
}

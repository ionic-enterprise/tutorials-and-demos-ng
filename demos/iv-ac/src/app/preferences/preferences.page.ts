import { Component, OnInit, inject } from '@angular/core';
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
  private auth = inject(AuthenticationService);
  private modalController = inject(ModalController);
  private navController = inject(NavController);
  private session = inject(SessionVaultService);

  hideInBackground = false;
  useBiometrics = false;
  useSystemPasscode = false;
  useCustomPasscode = false;
  disableBiometrics = false;
  disableCustomPasscode = false;
  disableHideInBackground = false;
  disableSystemPasscode = false;

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

  useBiometricsChanged(event: { detail: { checked: boolean } }) {
    this.useBiometrics = event.detail.checked;
    if (this.useBiometrics) {
      this.useCustomPasscode = false;
    }
    this.setVaultLockMode();
  }

  useSystemPasscodeChanged(event: { detail: { checked: boolean } }) {
    this.useSystemPasscode = event.detail.checked;
    if (this.useSystemPasscode) {
      this.useCustomPasscode = false;
    }
    this.setVaultLockMode();
  }

  useCustomPasscodeChanged(event: { detail: { checked: boolean } }) {
    this.useCustomPasscode = event.detail.checked;
    if (this.useCustomPasscode) {
      this.useBiometrics = false;
      this.useSystemPasscode = false;
    }
    this.setVaultLockMode();
  }

  hideInBackgroundChanged(event: { detail: { checked: boolean } }) {
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

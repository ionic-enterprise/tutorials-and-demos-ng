import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionVaultService } from '@app/core';
import { VaultTypePipe } from '@app/shared/vault-type.pipe';
import { Capacitor } from '@capacitor/core';
import { Device, IdentityVaultConfig, VaultType } from '@ionic-enterprise/identity-vault';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipsisVerticalOutline, hardwareChipOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-vault-control',
  templateUrl: 'vault-control.page.html',
  styleUrls: ['vault-control.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    VaultTypePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonFabList,
  ],
})
export class VaultControlPage {
  disableDeviceUnlock = true;
  disableCustomPasscode = true;
  disableInMemory = true;
  disableLock = true;
  config: IdentityVaultConfig | undefined;

  constructor(
    private navController: NavController,
    private sessionVault: SessionVaultService,
  ) {
    addIcons({ ellipsisVerticalOutline, hardwareChipOutline, listOutline });
  }

  async ionViewDidEnter() {
    this.config = this.sessionVault.getConfig();
    if (Capacitor.isNativePlatform()) {
      this.disableCustomPasscode = false;
      this.disableInMemory = false;
      this.disableLock = this.config.type === VaultType.SecureStorage;
      this.disableDeviceUnlock = !(await Device.isSystemPasscodeSet());
    }
  }

  clearVault() {
    return this.sessionVault.clear();
  }

  lockVault() {
    return this.sessionVault.lock();
  }

  useCustomPasscode() {
    this.disableLock = false;
    return this.sessionVault.setUnlockMode('SessionPIN');
  }

  useSystemPasscode() {
    this.disableLock = false;
    return this.sessionVault.setUnlockMode('SystemPIN');
  }

  useDevice() {
    this.disableLock = false;
    return this.sessionVault.setUnlockMode('Device');
  }

  clearOnLock() {
    this.disableLock = false;
    return this.sessionVault.setUnlockMode('ForceLogin');
  }

  neverLock() {
    this.disableLock = true;
    return this.sessionVault.setUnlockMode('NeverLock');
  }

  openDevicePage() {
    this.navController.navigateForward(['/', 'tabs', 'vault-control', 'device-info']);
  }

  openValuesPage() {
    this.navController.navigateForward(['/', 'tabs', 'vault-control', 'value-list']);
  }
}

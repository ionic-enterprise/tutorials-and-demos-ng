import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionVaultService } from '@app/core';
import { VaultTypePipe } from '@app/shared/vault-type.pipe';
import { Device, IdentityVaultConfig, VaultType } from '@ionic-enterprise/identity-vault';
import { IonicModule, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-vault-control',
  templateUrl: 'vault-control.page.html',
  styleUrls: ['vault-control.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, VaultTypePipe],
})
export class VaultControlPage {
  disableDeviceUnlock = true;
  disableCustomPasscode = true;
  disableInMemory = true;
  disableLock = true;
  config: IdentityVaultConfig;

  constructor(
    private navController: NavController,
    private platform: Platform,
    private sessionVault: SessionVaultService,
  ) {}

  async ionViewDidEnter() {
    this.config = await this.sessionVault.getConfig();
    if (this.platform.is('hybrid')) {
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

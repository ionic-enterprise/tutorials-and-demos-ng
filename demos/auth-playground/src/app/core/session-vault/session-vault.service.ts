import { Injectable } from '@angular/core';
import { AuthVendor } from '@app/models';
import { PinDialogComponent } from '@app/pin-dialog/pin-dialog.component';
import {
  BiometricPermissionState,
  BrowserVault,
  Device,
  DeviceSecurityType,
  IdentityVaultConfig,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';
import { ModalController, Platform } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { VaultFactoryService } from './vault-factory.service';
import { Preferences } from '@capacitor/preferences';

export type UnlockMode = 'Device' | 'SystemPIN' | 'SessionPIN' | 'NeverLock' | 'ForceLogin';

@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  private lockedSubject: Subject<boolean>;
  private onLockCallback: () => void;
  private vault: Vault | BrowserVault;
  private preferencesVault: Vault | BrowserVault;
  private vaultReady: Promise<void>;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private vaultFactory: VaultFactoryService,
  ) {
    this.lockedSubject = new Subject();
  }

  get locked(): Observable<boolean> {
    return this.lockedSubject.asObservable();
  }

  async getConfig(): Promise<IdentityVaultConfig> {
    await this.init();
    return this.vault.config;
  }

  async getKeys(): Promise<Array<string>> {
    await this.init();
    return this.vault.getKeys();
  }

  async getValue(key: string): Promise<any> {
    await this.init();
    return this.vault.getValue(key);
  }

  async lock(): Promise<void> {
    await this.init();
    return this.vault.lock();
  }

  async setValue(key: string, value: any): Promise<void> {
    await this.init();
    return this.vault.setValue(key, value);
  }

  async unlock(): Promise<void> {
    await this.init();
    return this.vault.unlock();
  }

  async canUnlock(): Promise<boolean> {
    await this.init();
    return !(await this.neverLock()) && !(await this.vault.isEmpty()) && (await this.vault.isLocked());
  }

  setAuthVendor(value: AuthVendor): Promise<void> {
    return Preferences.set({ key: 'AuthVendor', value });
  }

  async getAuthVendor(): Promise<AuthVendor | null> {
    const { value } = await Preferences.get({ key: 'AuthVendor' });
    return value as AuthVendor | null;
  }

  async initializeUnlockMode() {
    if (this.platform.is('hybrid')) {
      if (await Device.isSystemPasscodeSet()) {
        if (await Device.isBiometricsEnabled()) {
          await this.setUnlockMode('Device');
        } else {
          await this.setUnlockMode('SystemPIN');
        }
      } else {
        await this.setUnlockMode('SessionPIN');
      }
    }
  }

  async setUnlockMode(unlockMode: UnlockMode): Promise<void> {
    let type: VaultType;
    let deviceSecurityType: DeviceSecurityType;

    await this.init();

    switch (unlockMode) {
      case 'Device':
        await this.provision();
        type = VaultType.DeviceSecurity;
        deviceSecurityType = DeviceSecurityType.Both;
        break;

      case 'SystemPIN':
        type = VaultType.DeviceSecurity;
        deviceSecurityType = DeviceSecurityType.SystemPasscode;
        break;

      case 'SessionPIN':
        type = VaultType.CustomPasscode;
        deviceSecurityType = DeviceSecurityType.None;
        break;

      case 'ForceLogin':
        type = VaultType.InMemory;
        deviceSecurityType = DeviceSecurityType.None;
        break;

      case 'NeverLock':
        type = VaultType.SecureStorage;
        deviceSecurityType = DeviceSecurityType.None;
        break;

      default:
        type = VaultType.SecureStorage;
        deviceSecurityType = DeviceSecurityType.None;
    }

    this.setLastUnlockMode(unlockMode);

    return this.vault.updateConfig({
      ...this.vault.config,
      type,
      deviceSecurityType,
    });
  }

  // The following public methods are required by the TokenStorageProvider interface.
  async clear(): Promise<void> {
    await this.init();
    return this.vault.clear();
  }

  async getAccessToken(tokenName?: string): Promise<string | undefined | null> {
    await this.init();
    return this.vault.getValue(`AccessToken${tokenName || ''}`);
  }

  async getAuthResponse(): Promise<any | undefined | null> {
    await this.init();
    return this.vault.getValue('AuthResponse');
  }

  async getIdToken(): Promise<string | undefined | null> {
    await this.init();
    return this.vault.getValue('IdToken');
  }

  async getRefreshToken(): Promise<string | undefined | null> {
    await this.init();
    return this.vault.getValue('RefreshToken');
  }

  onLock(callback: () => void) {
    this.onLockCallback = callback;
  }

  async setAccessToken(value: string, tokenName?: string): Promise<void> {
    await this.init();
    return this.vault.setValue(`AccessToken${tokenName || ''}`, value);
  }

  async setAuthResponse(value: any): Promise<void> {
    await this.init();
    return this.vault.setValue('AuthResponse', value);
  }

  async setIdToken(value: string): Promise<void> {
    await this.init();
    return this.vault.setValue('IdToken', value);
  }

  async setRefreshToken(value: string): Promise<void> {
    await this.init();
    return this.vault.setValue('RefreshToken', value);
  }

  private init(): Promise<void> {
    if (!this.vaultReady) {
      this.vaultReady = new Promise(async (resolve) => {
        await this.platform.ready();

        this.preferencesVault = this.vaultFactory.create({
          key: 'io.ionic.auth-playground-ng-preferences',
          type: VaultType.SecureStorage,
        });

        this.vault = this.vaultFactory.create({
          key: 'io.ionic.auth-playground-ng',
          type: VaultType.SecureStorage,
          deviceSecurityType: DeviceSecurityType.None,
          lockAfterBackgrounded: 20000,
          shouldClearVaultAfterTooManyFailedAttempts: true,
          customPasscodeInvalidUnlockAttempts: 2,
          unlockVaultOnLoad: false,
        });

        this.vault.onLock(() => {
          if (this.onLockCallback) {
            this.onLockCallback();
          }
          this.lockedSubject.next(true);
        });

        this.vault.onUnlock(() => this.lockedSubject.next(false));

        this.vault.onPasscodeRequested(async (isPasscodeSetRequest: boolean) =>
          this.onPasscodeRequest(isPasscodeSetRequest),
        );
        resolve();
      });
    }

    return this.vaultReady;
  }

  private async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<void> {
    await this.init();

    const dlg = await this.modalController.create({
      backdropDismiss: false,
      component: PinDialogComponent,
      componentProps: {
        setPasscodeMode: isPasscodeSetRequest,
      },
    });
    dlg.present();
    const { data } = await dlg.onDidDismiss();
    this.vault.setCustomPasscode(data || '');
  }

  private async provision(): Promise<void> {
    await this.init();
    if ((await Device.isBiometricsAllowed()) === BiometricPermissionState.Prompt) {
      try {
        await Device.showBiometricPrompt({ iosBiometricsLocalizedReason: 'Please authenticate to continue' });
      } catch (error) {}
    }
  }

  // Preference Related Methods
  private async setLastUnlockMode(value: UnlockMode): Promise<void> {
    await this.init();
    return this.preferencesVault.setValue('LastUnlockMode', value);
  }

  private async neverLock(): Promise<boolean> {
    await this.init();
    const lockMode = await this.preferencesVault.getValue('LastUnlockMode');
    return lockMode === 'NeverLock';
  }
}

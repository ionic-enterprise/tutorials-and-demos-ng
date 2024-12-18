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
import { ModalController, Platform } from '@ionic/angular/standalone';
import { Observable, Subject } from 'rxjs';
import { VaultFactoryService } from './vault-factory.service';
import { Preferences } from '@capacitor/preferences';

export type UnlockMode = 'Device' | 'SystemPIN' | 'SessionPIN' | 'NeverLock' | 'ForceLogin';

@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  private lockedSubject: Subject<boolean>;
  private onLockCallback: (() => void) | undefined;
  private vault: Vault | BrowserVault;
  private preferencesVault: Vault | BrowserVault;
  private vaultReady: Promise<void> | undefined;

  constructor(
    vaultFactory: VaultFactoryService,
    private modalController: ModalController,
    private platform: Platform,
  ) {
    this.lockedSubject = new Subject();
    this.preferencesVault = vaultFactory.create();
    this.vault = vaultFactory.create();
  }

  get locked(): Observable<boolean> {
    return this.lockedSubject.asObservable();
  }

  initialize(): Promise<void> {
    if (!this.vaultReady) {
      // eslint-disable-next-line no-async-promise-executor
      this.vaultReady = new Promise(async (resolve) => {
        await this.platform.ready();

        await this.preferencesVault.initialize({
          key: 'io.ionic.auth-playground-ng-preferences',
          type: VaultType.SecureStorage,
        });

        try {
          await this.vault.initialize({
            key: 'io.ionic.auth-playground-ng',
            type: VaultType.SecureStorage,
            deviceSecurityType: DeviceSecurityType.None,
            lockAfterBackgrounded: 5000,
            shouldClearVaultAfterTooManyFailedAttempts: true,
            customPasscodeInvalidUnlockAttempts: 2,
            unlockVaultOnLoad: false,
          });
        } catch (e: unknown) {
          console.error(e);
          await this.vault.clear();
          await this.setUnlockMode('NeverLock');
        }

        this.vault.onLock(() => {
          if (this.onLockCallback) {
            this.onLockCallback();
          }
          this.lockedSubject.next(true);
        });

        this.vault.onUnlock(() => this.lockedSubject.next(false));

        this.vault.onError((error) => {
          console.error(error);
        });

        this.vault.onPasscodeRequested(async (isPasscodeSetRequest: boolean) =>
          this.onPasscodeRequest(isPasscodeSetRequest),
        );
        resolve();
      });
    }

    return this.vaultReady;
  }

  getConfig(): IdentityVaultConfig {
    return this.vault.config as IdentityVaultConfig;
  }

  getKeys(): Promise<string[]> {
    return this.vault.getKeys();
  }

  getValue<T>(key: string): Promise<T | null> {
    return this.vault.getValue<T>(key);
  }

  lock(): Promise<void> {
    return this.vault.lock();
  }

  setValue<T>(key: string, value: T): Promise<void> {
    return this.vault.setValue(key, value);
  }

  unlock(): Promise<void> {
    return this.vault.unlock();
  }

  async canUnlock(): Promise<boolean> {
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
      ...(this.vault.config as IdentityVaultConfig),
      type,
      deviceSecurityType,
    });
  }

  // The following public methods are required by the TokenStorageProvider interface.
  clear(): Promise<void> {
    return this.vault.clear();
  }

  getAccessToken(tokenName?: string): Promise<string | undefined | null> {
    return this.vault.getValue(`AccessToken${tokenName || ''}`);
  }

  getAuthResponse<T>(): Promise<T | undefined | null> {
    return this.vault.getValue('AuthResponse');
  }

  getIdToken(): Promise<string | undefined | null> {
    return this.vault.getValue('IdToken');
  }

  getRefreshToken(): Promise<string | undefined | null> {
    return this.vault.getValue('RefreshToken');
  }

  onLock(callback: () => void) {
    this.onLockCallback = callback;
  }

  setAccessToken(value: string, tokenName?: string): Promise<void> {
    return this.vault.setValue(`AccessToken${tokenName || ''}`, value);
  }

  setAuthResponse<T>(value: T): Promise<void> {
    return this.vault.setValue('AuthResponse', value);
  }

  setIdToken(value: string): Promise<void> {
    return this.vault.setValue('IdToken', value);
  }

  setRefreshToken(value: string): Promise<void> {
    return this.vault.setValue('RefreshToken', value);
  }

  private async onPasscodeRequest(isPasscodeSetRequest: boolean): Promise<void> {
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
    if ((await Device.isBiometricsAllowed()) === BiometricPermissionState.Prompt) {
      try {
        await Device.showBiometricPrompt({ iosBiometricsLocalizedReason: 'Please authenticate to continue' });
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Preference Related Methods
  private async setLastUnlockMode(value: UnlockMode): Promise<void> {
    return this.preferencesVault.setValue('LastUnlockMode', value);
  }

  private async neverLock(): Promise<boolean> {
    const lockMode = await this.preferencesVault.getValue('LastUnlockMode');
    return lockMode === 'NeverLock';
  }
}

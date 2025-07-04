import { Injectable, inject } from '@angular/core';
import { PinDialogComponent } from '@app/pin-dialog/pin-dialog.component';
import { Capacitor } from '@capacitor/core';
import { AuthResult } from '@ionic-enterprise/auth';
import {
  BiometricPermissionState,
  BrowserVault,
  Device,
  DeviceSecurityType,
  IdentityVaultConfig,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';
import { ModalController } from '@ionic/angular/standalone';
import { Observable, Subject } from 'rxjs';
import { VaultFactoryService } from '../vault-factory/vault-factory.service';

type UnlockMode = 'Device' | 'SessionPIN' | 'NeverLock';
@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  private modalController = inject(ModalController);

  private lockedSubject: Subject<boolean>;
  private vault: Vault | BrowserVault;
  private vaultReady: Promise<void> | undefined;

  constructor() {
    const vaultFactory = inject(VaultFactoryService);

    this.lockedSubject = new Subject();
    this.vault = vaultFactory.create();
  }

  get locked$(): Observable<boolean> {
    return this.lockedSubject.asObservable();
  }

  initialize() {
    if (!this.vaultReady) {
      // eslint-disable-next-line no-async-promise-executor
      this.vaultReady = new Promise(async (resolve) => {
        try {
          await this.vault.initialize({
            key: 'io.ionic.auth-playground-ng',
            type: VaultType.SecureStorage,
            lockAfterBackgrounded: undefined,
            shouldClearVaultAfterTooManyFailedAttempts: true,
            customPasscodeInvalidUnlockAttempts: 2,
            unlockVaultOnLoad: false,
          });
        } catch {
          await this.vault.clear();
          await this.setUnlockMode('NeverLock');
        }

        this.vault.onLock(() => this.lockedSubject.next(true));
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

  disableLocking(): Promise<void> {
    return this.vault.updateConfig({
      ...(this.vault.config as IdentityVaultConfig),
      lockAfterBackgrounded: undefined,
    });
  }

  enableLocking(): Promise<void> {
    return this.vault.updateConfig({
      ...(this.vault.config as IdentityVaultConfig),
      lockAfterBackgrounded: 2000,
    });
  }

  async resetUnlockMode(): Promise<void> {
    await this.setUnlockMode('NeverLock');
  }

  async initializeUnlockMode(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      if (await Device.isSystemPasscodeSet()) {
        await this.setUnlockMode('Device');
      } else {
        await this.setUnlockMode('SessionPIN');
      }
    }
  }

  async setSession(session: AuthResult): Promise<void> {
    await this.vault.setValue('session', session);
  }

  getSession(): Promise<AuthResult | null> {
    return this.vault.getValue('session');
  }

  clearSession(): Promise<void> {
    return this.vault.clear();
  }

  async sessionIsLocked(): Promise<boolean> {
    return !(await this.vault.isEmpty()) && (await this.vault.isLocked());
  }

  unlockSession(): Promise<void> {
    return this.vault.unlock();
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

  private async setUnlockMode(unlockMode: UnlockMode): Promise<void> {
    let type: VaultType;
    let deviceSecurityType: DeviceSecurityType;

    switch (unlockMode) {
      case 'Device':
        await this.provision();
        type = VaultType.DeviceSecurity;
        deviceSecurityType = DeviceSecurityType.Both;
        break;

      case 'SessionPIN':
        type = VaultType.CustomPasscode;
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

    return this.vault.updateConfig({
      ...(this.vault.config as IdentityVaultConfig),
      type,
      deviceSecurityType,
    });
  }

  private async provision(): Promise<void> {
    if ((await Device.isBiometricsAllowed()) === BiometricPermissionState.Prompt) {
      await Device.showBiometricPrompt({ iosBiometricsLocalizedReason: 'Authenticate to continue' });
    }
  }
}

import { Injectable } from '@angular/core';
import { PinDialogComponent } from '@app/pin-dialog/pin-dialog.component';
import { AuthResult } from '@ionic-enterprise/auth';
import {
  BiometricPermissionState,
  BrowserVault,
  Device,
  DeviceSecurityType,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { Observable, Subject } from 'rxjs';
import { VaultFactoryService } from '../vault-factory/vault-factory.service';

type UnlockMode = 'Device' | 'SessionPIN' | 'NeverLock';
@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  private lockedSubject: Subject<boolean>;
  private vault: Vault | BrowserVault;
  private vaultReady: Promise<void>;

  constructor(
    vaultFactory: VaultFactoryService,
    private modalController: ModalController,
    private platform: Platform,
  ) {
    this.lockedSubject = new Subject();
    this.vault = vaultFactory.create();
  }

  get locked$(): Observable<boolean> {
    return this.lockedSubject.asObservable();
  }

  initialize() {
    if (!this.vaultReady) {
      this.vaultReady = new Promise(async (resolve) => {
        await this.platform.ready();

        await this.vault.initialize({
          key: 'io.ionic.auth-playground-ng',
          type: VaultType.SecureStorage,
          lockAfterBackgrounded: null,
          shouldClearVaultAfterTooManyFailedAttempts: true,
          customPasscodeInvalidUnlockAttempts: 2,
          unlockVaultOnLoad: false,
        });

        this.vault.onLock(() => this.lockedSubject.next(true));
        this.vault.onUnlock(() => this.lockedSubject.next(false));

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
      ...this.vault.config,
      lockAfterBackgrounded: null,
    });
  }

  enableLocking(): Promise<void> {
    return this.vault.updateConfig({
      ...this.vault.config,
      lockAfterBackgrounded: 2000,
    });
  }

  async resetUnlockMode(): Promise<void> {
    await this.setUnlockMode('NeverLock');
  }

  async initializeUnlockMode(): Promise<void> {
    if (this.platform.is('hybrid')) {
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
      ...this.vault.config,
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

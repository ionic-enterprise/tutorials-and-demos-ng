import { Injectable, NgZone } from '@angular/core';
import { PinDialogComponent } from '@app/pin-dialog/pin-dialog.component';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import {
  BiometricPermissionState,
  BrowserVault,
  Device,
  DeviceSecurityType,
  IdentityVaultConfig,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';
import { AuthResult } from '@ionic-enterprise/auth';
import { ModalController } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { VaultFactoryService } from './vault-factory.service';

export type UnlockMode =
  | 'Biometrics'
  | 'BiometricsWithPasscode'
  | 'SystemPasscode'
  | 'CustomPasscode'
  | 'SecureStorage';

const config: IdentityVaultConfig = {
  key: 'com.ionic.teataster',
  type: VaultType.SecureStorage,
  deviceSecurityType: DeviceSecurityType.None,
  lockAfterBackgrounded: 2000,
  shouldClearVaultAfterTooManyFailedAttempts: true,
  customPasscodeInvalidUnlockAttempts: 2,
  unlockVaultOnLoad: false,
};

const sessionKey = 'auth-session';
const hideInBackgroundKey = 'hide-in-background';
const modeKey = 'mode-key';

@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  private lockedSubject: Subject<boolean>;
  private vault: Vault | BrowserVault;
  private platform: string;

  constructor(
    private modalController: ModalController,
    private ngZone: NgZone,
    vaultFactory: VaultFactoryService,
  ) {
    this.platform = Capacitor.getPlatform();
    this.vault = vaultFactory.create(config);
    this.lockedSubject = new Subject();

    this.vault.onLock(() => {
      this.lockedSubject.next(true);
    });

    this.vault.onUnlock(() => {
      this.lockedSubject.next(false);
    });

    this.vault.onPasscodeRequested(async (isPasscodeSetRequest: boolean) =>
      this.onPasscodeRequest(isPasscodeSetRequest),
    );
  }

  get locked(): Observable<boolean> {
    return this.lockedSubject.asObservable();
  }

  async setSession(session: AuthResult): Promise<void> {
    await this.vault.setValue(sessionKey, session);
  }

  async getSession(): Promise<AuthResult | null> {
    return this.vault.getValue(sessionKey);
  }

  async lockVault() {
    await this.vault.lock();
  }

  async unlockVault() {
    await this.vault.unlock();
  }

  async canUnlock() {
    const { value } = await Preferences.get({ key: modeKey });
    return (
      (value || 'SecureStorage') !== 'SecureStorage' && !(await this.vault.isEmpty()) && (await this.vault.isLocked())
    );
  }

  canHideContentsInBackground(): boolean {
    return this.platform !== 'web';
  }

  async canUseBiometrics(): Promise<boolean> {
    return this.platform !== 'web' && (await Device.isBiometricsEnabled());
  }

  canUseCustomPasscode(): boolean {
    return this.platform !== 'web';
  }

  async canUseSystemPasscode(): Promise<boolean> {
    return this.platform !== 'web' && (await Device.isSystemPasscodeSet());
  }

  async hideContentsInBackground(value: boolean): Promise<void> {
    await Device.setHideScreenOnBackground(value, true);
    return Preferences.set({ key: hideInBackgroundKey, value: JSON.stringify(value) });
  }

  async isHidingContentsInBackground(): Promise<boolean> {
    const { value } = await Preferences.get({ key: hideInBackgroundKey });
    return JSON.parse(value || 'false');
  }

  async clear(): Promise<void> {
    await this.vault.clear();
    await this.setUnlockMode('SecureStorage');
  }

  async getUnlockMode(): Promise<UnlockMode> {
    const { value } = await Preferences.get({ key: modeKey });
    return (value as UnlockMode | null) || 'SecureStorage';
  }

  private async provision(): Promise<void> {
    if ((await Device.isBiometricsAllowed()) === BiometricPermissionState.Prompt) {
      try {
        await Device.showBiometricPrompt({ iosBiometricsLocalizedReason: 'Please authenticate to continue' });
      } catch (error) {
        null;
      }
    }
  }

  async setUnlockMode(unlockMode: UnlockMode): Promise<void> {
    let type: VaultType;
    let deviceSecurityType: DeviceSecurityType;

    switch (unlockMode) {
      case 'Biometrics':
        await this.provision();
        type = VaultType.DeviceSecurity;
        deviceSecurityType = DeviceSecurityType.Biometrics;
        break;

      case 'BiometricsWithPasscode':
        await this.provision();
        type = VaultType.DeviceSecurity;
        deviceSecurityType = DeviceSecurityType.Both;
        break;

      case 'SystemPasscode':
        type = VaultType.DeviceSecurity;
        deviceSecurityType = DeviceSecurityType.SystemPasscode;
        break;

      case 'CustomPasscode':
        type = VaultType.CustomPasscode;
        deviceSecurityType = DeviceSecurityType.None;
        break;

      case 'SecureStorage':
        type = VaultType.SecureStorage;
        deviceSecurityType = DeviceSecurityType.None;
        break;

      default:
        type = VaultType.SecureStorage;
        deviceSecurityType = DeviceSecurityType.None;
    }

    await this.vault.updateConfig({
      ...(this.vault.config as IdentityVaultConfig),
      type,
      deviceSecurityType,
    });

    await Preferences.set({ key: modeKey, value: unlockMode });
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
}

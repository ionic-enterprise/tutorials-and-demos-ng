import { Injectable } from '@angular/core';
import {
  BiometricPermissionState,
  BrowserVault,
  Device,
  DeviceSecurityType,
  IdentityVaultConfig,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';
import { Session } from '../models/session';
import { VaultFactory } from './vault.factory';
import { Observable, Subject } from 'rxjs';

export type UnlockMode = 'BiometricsWithPasscode' | 'InMemory' | 'SecureStorage';

@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  private lockedSubject: Subject<boolean>;
  private vault: BrowserVault | Vault;

  constructor() {
    this.vault = VaultFactory.create();
    this.lockedSubject = new Subject<boolean>();
  }

  get locked$(): Observable<boolean> {
    return this.lockedSubject.asObservable();
  }

  async initialize(): Promise<void> {
    await this.vault.initialize({
      key: 'io.ionic.gettingstartediv',
      type: VaultType.InMemory,
      deviceSecurityType: DeviceSecurityType.None,
      lockAfterBackgrounded: 30000,
    });

    this.vault.onLock(() => {
      alert('locked');
      this.lockedSubject.next(true);
    });
    this.vault.onUnlock(() => this.lockedSubject.next(false));
  }

  async storeSession(session: Session): Promise<void> {
    this.vault.setValue('session', session);
  }

  async getSession(): Promise<Session | null> {
    if (await this.vault.isEmpty()) {
      return null;
    }
    return this.vault.getValue<Session>('session');
  }

  async clearSession(): Promise<void> {
    await this.vault.clear();
  }

  async lock(): Promise<void> {
    await this.vault.lock();
  }

  async unlock(): Promise<void> {
    await this.vault.unlock();
  }

  async isLocked(): Promise<boolean> {
    return (
      this.vault.config?.type !== VaultType.SecureStorage &&
      this.vault.config?.type !== VaultType.InMemory &&
      !(await this.vault.isEmpty()) &&
      (await this.vault.isLocked())
    );
  }

  async updateUnlockMode(mode: UnlockMode): Promise<void> {
    const type = await this.getVaultType(mode);
    const deviceSecurityType = type === VaultType.DeviceSecurity ? DeviceSecurityType.Both : DeviceSecurityType.None;
    const lockAfterBackgrounded = type === VaultType.InMemory ? 30000 : 2000;
    await this.vault.updateConfig({
      ...(this.vault.config as IdentityVaultConfig),
      type,
      deviceSecurityType,
      lockAfterBackgrounded,
    });
  }

  async enhanceVault(): Promise<void> {
    if (await Device.isSystemPasscodeSet()) {
      await this.updateUnlockMode('BiometricsWithPasscode');
    } else {
      await this.updateUnlockMode('InMemory');
    }
  }

  private async getVaultType(mode: UnlockMode): Promise<VaultType> {
    if (mode === 'BiometricsWithPasscode') {
      await this.provisionBiometrics();
      return (await Device.isBiometricsEnabled()) &&
        (await Device.isBiometricsAllowed()) !== BiometricPermissionState.Granted
        ? VaultType.InMemory
        : VaultType.DeviceSecurity;
    }

    return mode === 'InMemory' ? VaultType.InMemory : VaultType.SecureStorage;
  }

  private async provisionBiometrics(): Promise<void> {
    if ((await Device.isBiometricsAllowed()) === BiometricPermissionState.Prompt) {
      try {
        await Device.showBiometricPrompt({ iosBiometricsLocalizedReason: 'Please authenticate to continue' });
      } catch (error) {
        null;
      }
    }
  }
}

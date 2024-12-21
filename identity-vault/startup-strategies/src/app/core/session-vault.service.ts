import { Injectable } from '@angular/core';
import {
  BrowserVault,
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
    try {
      await this.vault.initialize({
        key: 'io.ionic.gettingstartediv',
        type: VaultType.SecureStorage,
        deviceSecurityType: DeviceSecurityType.None,
        lockAfterBackgrounded: 2000,
      });
    } catch {
      await this.vault.clear();
      await this.updateUnlockMode('SecureStorage');
    }

    this.vault.onLock(() => this.lockedSubject.next(true));
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
    const type =
      mode === 'BiometricsWithPasscode'
        ? VaultType.DeviceSecurity
        : mode === 'InMemory'
          ? VaultType.InMemory
          : VaultType.SecureStorage;
    const deviceSecurityType = type === VaultType.DeviceSecurity ? DeviceSecurityType.Both : DeviceSecurityType.None;
    await this.vault.updateConfig({
      ...(this.vault.config as IdentityVaultConfig),
      type,
      deviceSecurityType,
    });
  }
}

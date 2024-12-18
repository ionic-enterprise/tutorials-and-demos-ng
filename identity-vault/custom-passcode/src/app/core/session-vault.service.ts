import { Injectable } from '@angular/core';
import {
  BrowserVault,
  DeviceSecurityType,
  IdentityVaultConfig,
  Vault,
  VaultType,
} from '@ionic-enterprise/identity-vault';
import { ModalController } from '@ionic/angular/standalone';
import { Observable, Subject } from 'rxjs';
import { Session } from '../models/session';
import { PinDialogComponent } from '../pin-dialog/pin-dialog.component';
import { VaultFactory } from './vault.factory';

export type UnlockMode = 'BiometricsWithPasscode' | 'CustomPasscode' | 'InMemory' | 'SecureStorage';

@Injectable({
  providedIn: 'root',
})
export class SessionVaultService {
  private lockedSubject: Subject<boolean>;
  private vault: BrowserVault | Vault;

  constructor(private modalController: ModalController) {
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
    } catch (e: unknown) {
      console.error(e);
      await this.vault.clear();
      await this.updateUnlockMode('SecureStorage');
    }

    this.vault.onLock(() => this.lockedSubject.next(true));
    this.vault.onUnlock(() => this.lockedSubject.next(false));

    this.vault.onPasscodeRequested(async (isPasscodeSetRequest: boolean) => {
      const modal = await this.modalController.create({
        component: PinDialogComponent,
        backdropDismiss: false,
        componentProps: {
          setPasscodeMode: isPasscodeSetRequest,
        },
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      this.vault.setCustomPasscode(data || '');
    });
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
        : mode === 'CustomPasscode'
          ? VaultType.CustomPasscode
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

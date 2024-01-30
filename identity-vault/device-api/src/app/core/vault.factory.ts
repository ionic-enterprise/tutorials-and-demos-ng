import { Capacitor } from '@capacitor/core';
import { BrowserVault, Vault } from '@ionic-enterprise/identity-vault';

export class VaultFactory {
  static create(): BrowserVault | Vault {
    return Capacitor.isNativePlatform() ? new Vault() : new BrowserVault();
  }
}

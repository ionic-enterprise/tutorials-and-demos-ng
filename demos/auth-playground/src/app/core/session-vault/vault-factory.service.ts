import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { BrowserVault, Vault } from '@ionic-enterprise/identity-vault';

@Injectable({
  providedIn: 'root',
})
export class VaultFactoryService {
  create(): Vault | BrowserVault {
    return Capacitor.isNativePlatform() ? new Vault() : new BrowserVault();
  }
}

import { Injectable } from '@angular/core';
import { BrowserVault, Vault } from '@ionic-enterprise/identity-vault';
import { Platform } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root',
})
export class VaultFactoryService {
  constructor(private platform: Platform) {}

  create(): Vault | BrowserVault {
    return this.platform.is('hybrid') ? new Vault() : new BrowserVault();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BrowserVault, DeviceSecurityType, Vault, VaultType } from '@ionic-enterprise/identity-vault';
import { firstValueFrom } from 'rxjs';
import { VaultFactoryService } from '../vault-factory/vault-factory.service';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private vault: Vault | BrowserVault;
  private vaultReady: Promise<void>;

  constructor(
    private http: HttpClient,
    vaultFactory: VaultFactoryService,
  ) {
    this.vault = vaultFactory.create();
  }

  async getDatabaseKey(): Promise<string> {
    let key = await this.vault.getValue('database-key');
    if (!key) {
      key = (await firstValueFrom(this.http.get<{ storage: string }>(`${environment.dataService}/keys`))).storage;
      this.vault.setValue('database-key', key);
    }
    return key;
  }

  initialize(): Promise<void> {
    if (!this.vaultReady) {
      this.vaultReady = new Promise(async (resolve) => {
        await this.vault.initialize({
          key: 'io.ionic.csdemosecurestoragekeys',
          type: VaultType.SecureStorage,
          deviceSecurityType: DeviceSecurityType.None,
          unlockVaultOnLoad: false,
        });
        resolve();
      });
    }
    return this.vaultReady;
  }
}

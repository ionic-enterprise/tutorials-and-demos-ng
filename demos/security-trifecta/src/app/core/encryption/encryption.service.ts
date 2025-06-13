import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { BrowserVault, DeviceSecurityType, Vault, VaultType } from '@ionic-enterprise/identity-vault';
import { firstValueFrom } from 'rxjs';
import { VaultFactoryService } from '../vault-factory/vault-factory.service';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private http = inject(HttpClient);

  private vault: Vault | BrowserVault;
  private vaultReady: Promise<void> | undefined;

  constructor() {
    const vaultFactory = inject(VaultFactoryService);

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
      // eslint-disable-next-line no-async-promise-executor
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

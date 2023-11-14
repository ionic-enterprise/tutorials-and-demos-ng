import { Injectable } from '@angular/core';
import { KeyValueStorage } from '@ionic-enterprise/secure-storage/ngx';
import { Platform } from '@ionic/angular/standalone';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private ready: Promise<void> | null = null;

  constructor(
    private encryption: EncryptionService,
    private platform: Platform,
    private storage: KeyValueStorage,
  ) {}

  async get<T>(key: string): Promise<T> {
    await this.initialize();
    return this.storage.get(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.initialize();
    await this.storage.set(key, value);
  }

  private async initialize(): Promise<void> {
    if (!this.ready) {
      this.ready = this.createStorage();
    }
    return this.ready;
  }

  private async createStorage(): Promise<void> {
    if (this.platform.is('hybrid')) {
      const key = await this.encryption.getDatabaseKey();
      return this.storage.create(key);
    }
    return this.storage.create('');
  }
}

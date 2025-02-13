import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { KeyValueKey, KeyValuePair, KVStorageProvider } from './kv-types';
import { MobileKVStore } from './mobile-kv-store';
import { WebKVStore } from './web-kv-store';

@Injectable({
  providedIn: 'root',
})
export class InboxStorageService implements KVStorageProvider {
  private provider: KVStorageProvider;

  constructor() {
    this.provider = Capacitor.isNativePlatform() ? new MobileKVStore('inbox') : new WebKVStore('inbox');
  }

  clear(): Promise<void> {
    return this.provider.clear();
  }

  getAll(): Promise<KeyValuePair[]> {
    return this.provider.getAll();
  }

  getValue(key: KeyValueKey): Promise<any | undefined> {
    return this.provider.getValue(key);
  }

  removeValue(key: KeyValueKey): Promise<void> {
    return this.provider.removeValue(key);
  }

  setValue(key: KeyValueKey, value: any): Promise<void> {
    return this.provider.setValue(key, value);
  }

  getKeys(): Promise<KeyValueKey[]> {
    return this.provider.getKeys();
  }
}

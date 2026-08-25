import { inject } from '@angular/core';
import { DatabaseService } from './database.service';
import { KeyValueCollection, KeyValueKey, KeyValuePair, KVStorageProvider } from './kv-types';

export class MobileKVStore implements KVStorageProvider {
  private database = inject(DatabaseService);

  constructor(private collection: KeyValueCollection) {}

  async clear(): Promise<void> {
    const handle = await this.database.getHandle();
    if (handle) {
      await handle.run('DELETE FROM KeyValuePairs WHERE collection = ?', [this.collection]);
    }
  }

  async getAll(): Promise<KeyValuePair[]> {
    const handle = await this.database.getHandle();
    if (!handle) return [];

    const result = await handle.query('SELECT id, value FROM KeyValuePairs WHERE collection = ? ORDER BY id', [
      this.collection,
    ]);
    return (result.values ?? []).map(({ id, value }) => ({ key: JSON.parse(id), value: JSON.parse(value) }));
  }

  async getValue(key: KeyValueKey): Promise<any | undefined> {
    const handle = await this.database.getHandle();
    if (!handle) return undefined;

    const result = await handle.query('SELECT value FROM KeyValuePairs WHERE id = ? AND collection = ?', [
      JSON.stringify(key),
      this.collection,
    ]);
    return result.values?.length ? JSON.parse(result.values[0].value) : undefined;
  }

  async removeValue(key: KeyValueKey): Promise<void> {
    const handle = await this.database.getHandle();
    if (handle) {
      await handle.run('DELETE FROM KeyValuePairs WHERE id = ? AND collection = ?', [
        JSON.stringify(key),
        this.collection,
      ]);
    }
  }

  async setValue(key: KeyValueKey, value: any): Promise<void> {
    const handle = await this.database.getHandle();
    if (handle) {
      await handle.run(
        'INSERT INTO KeyValuePairs (id, collection, value) VALUES (?, ?, ?) ON CONFLICT(id, collection) DO UPDATE SET value = excluded.value',
        [JSON.stringify(key), this.collection, JSON.stringify(value)],
      );
    }
  }

  async getKeys(): Promise<KeyValueKey[]> {
    const handle = await this.database.getHandle();
    if (!handle) return [];

    const result = await handle.query('SELECT id FROM KeyValuePairs WHERE collection = ? ORDER BY id', [
      this.collection,
    ]);
    return (result.values ?? []).map(({ id }) => JSON.parse(id));
  }
}

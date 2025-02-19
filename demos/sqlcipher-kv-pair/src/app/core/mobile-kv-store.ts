import { inject } from '@angular/core';
import { DatabaseService } from './database.service';
import { KeyValueCollection, KeyValueKey, KeyValuePair, KVStorageProvider } from './kv-types';

export class MobileKVStore implements KVStorageProvider {
  private database = inject(DatabaseService);

  constructor(private collection: KeyValueCollection) {}

  async clear(): Promise<void> {
    const handle = await this.database.getHandle();
    if (handle) {
      await handle.transaction((tx) => {
        tx.executeSql('DELETE FROM KeyValuePairs WHERE collection = ?', [this.collection], () => {});
      });
    }
  }

  async getAll(): Promise<KeyValuePair[]> {
    const kvPairs: { key: any; value: any }[] = [];
    const handle = await this.database.getHandle();
    if (handle) {
      await handle.transaction((tx) =>
        tx.executeSql(
          `SELECT id, value FROM KeyValuePairs WHERE collection = ? ORDER BY id`,
          [this.collection],
          (_t: any, r: any) => {
            for (let i = 0; i < r.rows.length; i++) {
              const { id, value } = r.rows.item(i);
              kvPairs.push({ key: JSON.parse(id), value: JSON.parse(value) });
            }
          },
        ),
      );
    }
    return kvPairs;
  }

  async getValue(key: KeyValueKey): Promise<any | undefined> {
    let value: any = undefined;
    const handle = await this.database.getHandle();
    if (handle) {
      await handle.transaction((tx) =>
        tx.executeSql(
          `SELECT value FROM KeyValuePairs WHERE id = ? AND collection = ?`,
          [JSON.stringify(key), this.collection],
          (_t: any, r: any) => {
            if (r.rows.length) {
              value = JSON.parse(r.rows.item(0).value);
            }
          },
        ),
      );
    }
    return value;
  }

  async removeValue(key: KeyValueKey): Promise<void> {
    const handle = await this.database.getHandle();
    if (handle) {
      await handle.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM KeyValuePairs WHERE id = ? AND collection = ?',
          [JSON.stringify(key), this.collection],
          () => {},
        );
      });
    }
  }

  async setValue(key: KeyValueKey, value: any): Promise<void> {
    const handle = await this.database.getHandle();
    if (handle) {
      await handle.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO KeyValuePairs (id, collection, value) VALUES (?, ?, ?)' +
            ' ON CONFLICT(id, collection) DO' +
            ' UPDATE SET value = ?' +
            ' WHERE id = ?' +
            ' AND collection = ?',
          [
            JSON.stringify(key),
            this.collection,
            JSON.stringify(value),
            JSON.stringify(value),
            JSON.stringify(key),
            this.collection,
          ],
          () => {},
        );
      });
    }
  }

  async getKeys(): Promise<KeyValueKey[]> {
    const keys: KeyValueKey[] = [];
    const handle = await this.database.getHandle();
    if (handle) {
      await handle.transaction((tx) =>
        tx.executeSql(
          `SELECT id FROM KeyValuePairs WHERE collection = ? ORDER BY id`,
          [this.collection],
          (_t: any, r: any) => {
            for (let i = 0; i < r.rows.length; i++) {
              const { id } = r.rows.item(i);
              keys.push(JSON.parse(id));
            }
          },
        ),
      );
    }
    return keys;
  }
}

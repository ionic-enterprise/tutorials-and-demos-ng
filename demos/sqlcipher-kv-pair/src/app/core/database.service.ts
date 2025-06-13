import { Injectable, inject } from '@angular/core';
import { DbTransaction, SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite';
import { Capacitor } from '@capacitor/core';
import { EncryptionKeysService } from './encryption-keys.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private keys = inject(EncryptionKeysService);

  private handle: SQLiteObject | null = null;

  async getHandle(): Promise<SQLiteObject | null> {
    if (!this.handle) {
      this.handle = await this.openDatabase();
      if (this.handle) {
        this.handle.transaction((tx: DbTransaction) => this.createTables(tx));
      }
    }
    return this.handle;
  }

  private async openDatabase(): Promise<SQLiteObject | null> {
    if (Capacitor.isNativePlatform()) {
      const key = this.keys.getDatabaseKey();
      if (key) {
        return SQLite.create({
          name: 'emailcache.db',
          location: 'default',
          key,
        });
      }
    }
    return null;
  }

  createTables(transaction: DbTransaction): void {
    transaction.executeSql(
      'CREATE TABLE IF NOT EXISTS KeyValuePairs (id TEXT, collection TEXT, value TEXT, PRIMARY KEY (id, collection))',
    );
  }
}

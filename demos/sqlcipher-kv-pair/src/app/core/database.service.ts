import { Injectable, inject } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { EncryptionKeysService } from './encryption-keys.service';

const DATABASE_NAME = 'emailcache';
const LEGACY_DATABASE_NAME = 'emailcache.db';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private keys = inject(EncryptionKeysService);
  private sqlite = new SQLiteConnection(CapacitorSQLite);

  private handle: SQLiteDBConnection | null = null;

  async getHandle(): Promise<SQLiteDBConnection | null> {
    if (!this.handle) {
      try {
        this.handle = await this.openDatabase();
      } catch (error) {
        console.error('Unable to open the encrypted database', error);
        this.handle = null;
      }
    }
    return this.handle;
  }

  private async openDatabase(): Promise<SQLiteDBConnection | null> {
    if (Capacitor.isNativePlatform()) {
      const key = this.keys.getDatabaseKey();
      if (key) {
        const secret = await this.sqlite.isSecretStored();
        if (secret.result) {
          const matches = await this.sqlite.checkEncryptionSecret(key);
          if (!matches.result) {
            throw new Error('The configured database key does not match the stored key');
          }
        } else {
          await this.sqlite.setEncryptionSecret(key);
        }
        const migrated = await this.migrateCordovaDatabase();

        const handle = await this.sqlite.createConnection(DATABASE_NAME, true, 'secret', 1, false);
        await handle.open();
        await handle.execute(
          'CREATE TABLE IF NOT EXISTS KeyValuePairs (id TEXT, collection TEXT, value TEXT, PRIMARY KEY (id, collection))',
        );
        if (migrated) {
          await this.sqlite.deleteOldDatabases(undefined, [LEGACY_DATABASE_NAME]);
        }
        return handle;
      }
    }
    return null;
  }

  private async migrateCordovaDatabase(): Promise<boolean> {
    const databases = await this.sqlite.getMigratableDbList();
    const databaseNames = databases.values ?? [];

    if (databaseNames.includes(LEGACY_DATABASE_NAME)) {
      await this.sqlite.addSQLiteSuffix(undefined, [LEGACY_DATABASE_NAME]);
      return true;
    }
    return false;
  }
}

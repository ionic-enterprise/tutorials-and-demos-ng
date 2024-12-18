/* eslint @typescript-eslint/no-explicit-any: off, @typescript-eslint/no-empty-function: off */
import { Injectable } from '@angular/core';
import { TeaCategory } from '@app/models';
import { DatabaseService } from '../database/database.service';

@Injectable({
  providedIn: 'root',
})
export class TeaCategoriesDatabaseService {
  constructor(private database: DatabaseService) {}

  async getAll(): Promise<TeaCategory[]> {
    const cats: TeaCategory[] = [];
    const handle = await this.database.getHandle();
    if (handle) {
      await handle.transaction((tx) =>
        tx.executeSql('SELECT id, name, description FROM TeaCategories ORDER BY name', [], (_t: any, r: any) => {
          for (let i = 0; i < r.rows.length; i++) {
            cats.push(r.rows.item(i));
          }
        }),
      );
    }
    return cats;
  }

  async upsert(cat: TeaCategory): Promise<void> {
    const handle = await this.database.getHandle();
    if (handle) {
      await handle.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO TeaCategories (id, name, description) VALUES (?, ?, ?)' +
            ' ON CONFLICT(id) DO' +
            ' UPDATE SET name = ?, description = ? where id = ?',
          [cat.id, cat.name, cat.description, cat.name, cat.description, cat.id],
          () => {},
        );
      });
    }
  }

  async pruneOthers(categories: TeaCategory[]): Promise<void> {
    const handle = await this.database.getHandle();
    const idsToKeep = categories.map((x) => x.id);
    if (handle) {
      await handle.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM TeaCategories WHERE id not in (${this.params(idsToKeep.length)})`,
          [...idsToKeep],
          () => {},
        );
      });
    }
  }

  private params(length: number): string {
    let str = '';
    for (let i = 0; i < length; i++) {
      str += `${i ? ', ' : ''}?`;
    }
    return str;
  }
}

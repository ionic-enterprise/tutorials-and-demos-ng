import { Injectable } from '@angular/core';
import { TeaCategory } from '@app/models';
import { Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { TeaCategoriesApiService } from '../tea-categories-api/tea-categories-api.service';
import { TeaCategoriesDatabaseService } from '../tea-categories-database/tea-categories-database.service';

@Injectable({
  providedIn: 'root',
})
export class TeaCategoriesService {
  private teaCategories: Array<TeaCategory>;

  constructor(
    private platform: Platform,
    private database: TeaCategoriesDatabaseService,
    private api: TeaCategoriesApiService,
  ) {}

  get data(): Array<TeaCategory> {
    return [...this.teaCategories];
  }

  async loadDatabaseFromApi(): Promise<void> {
    if (this.platform.is('hybrid')) {
      const cats = await firstValueFrom(this.api.getAll());
      this.database.pruneOthers(cats);
      const upserts = cats.map((x) => this.database.upsert(x));
      await Promise.all(upserts);
    }
  }

  async refresh(): Promise<void> {
    this.teaCategories = await (this.platform.is('hybrid')
      ? this.database.getAll()
      : firstValueFrom(this.api.getAll()));
  }

  async find(id: number): Promise<TeaCategory | undefined> {
    if (!this.teaCategories) {
      await this.refresh();
    }
    return this.teaCategories.find((x) => x.id === id);
  }
}

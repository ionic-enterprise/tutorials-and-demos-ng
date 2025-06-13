import { Injectable, inject } from '@angular/core';
import { TeaCategory } from '@app/models';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { TeaCategoriesApiService } from '../tea-categories-api/tea-categories-api.service';
import { TeaCategoriesDatabaseService } from '../tea-categories-database/tea-categories-database.service';

@Injectable({
  providedIn: 'root',
})
export class TeaCategoriesService {
  private database = inject(TeaCategoriesDatabaseService);
  private api = inject(TeaCategoriesApiService);

  private teaCategories: TeaCategory[] | undefined;

  get data(): TeaCategory[] {
    return [...(this.teaCategories ?? [])];
  }

  async loadDatabaseFromApi(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const cats = await firstValueFrom(this.api.getAll());
      this.database.pruneOthers(cats);
      const upserts = cats.map((x) => this.database.upsert(x));
      await Promise.all(upserts);
    }
  }

  async refresh(): Promise<void> {
    this.teaCategories = await (Capacitor.isNativePlatform()
      ? this.database.getAll()
      : firstValueFrom(this.api.getAll()));
  }

  async find(id: number): Promise<TeaCategory | undefined> {
    if (!this.teaCategories) {
      await this.refresh();
    }
    return this.teaCategories?.find((x) => x.id === id);
  }
}

import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TastingNotesApiService } from '../tasting-notes-api/tasting-notes-api.service';
import { TastingNotesDatabaseService } from '../tasting-notes-database/tasting-notes-database.service';
import { TastingNotesService } from '../tasting-notes/tasting-notes.service';
import { TeaCategoriesService } from '../tea-categories/tea-categories.service';

@Injectable({
  providedIn: 'root',
})
export class SyncService {
  constructor(
    private tastingNotesDatabase: TastingNotesDatabaseService,
    private tastingNotesApi: TastingNotesApiService,
    private tastingNotes: TastingNotesService,
    private teaCategories: TeaCategoriesService,
  ) {}

  async execute(): Promise<void> {
    await this.syncTastingNotes();
    await this.syncTeaCategories();
  }

  private async syncTastingNotes(): Promise<void> {
    await this.applyTastingNotesDatabaseChanges();
    await this.tastingNotesDatabase.clearSyncStatuses();
    await this.tastingNotes.loadDatabaseFromApi();
  }

  private async syncTeaCategories(): Promise<void> {
    await this.teaCategories.loadDatabaseFromApi();
  }

  private async applyTastingNotesDatabaseChanges(): Promise<void> {
    const saves: Array<Promise<any>> = [];
    const notes = await this.tastingNotesDatabase.getAll(true);
    notes.forEach((note) => {
      if (note.syncStatus === 'INSERT') {
        const { id, ...noteWithoutId } = note;
        saves.push(firstValueFrom(this.tastingNotesApi.save(noteWithoutId)));
      }
      if (note.syncStatus === 'UPDATE') {
        saves.push(firstValueFrom(this.tastingNotesApi.save(note)));
      }
      if (note.syncStatus === 'DELETE') {
        saves.push(firstValueFrom(this.tastingNotesApi.remove(note)));
      }
    });
    await Promise.all(saves);
  }
}

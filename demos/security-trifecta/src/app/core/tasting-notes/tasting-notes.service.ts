import { Injectable } from '@angular/core';
import { TastingNote } from '@app/models';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { TastingNotesApiService } from '../tasting-notes-api/tasting-notes-api.service';
import { TastingNotesDatabaseService } from '../tasting-notes-database/tasting-notes-database.service';

@Injectable({
  providedIn: 'root',
})
export class TastingNotesService {
  private tastingNotes: TastingNote[] | undefined;

  constructor(
    private api: TastingNotesApiService,
    private database: TastingNotesDatabaseService,
  ) {}

  get data(): TastingNote[] {
    return [...(this.tastingNotes ?? [])];
  }

  async find(id: number): Promise<TastingNote | undefined> {
    if (!this.tastingNotes) {
      await this.refresh();
    }
    return this.tastingNotes?.find((x) => x.id === id);
  }

  async loadDatabaseFromApi(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      const notes = await firstValueFrom(this.api.getAll());
      this.database.pruneOthers(notes);
      const upserts = notes.map((n) => this.database.upsert(n));
      await Promise.all(upserts);
    }
  }

  async refresh(): Promise<void> {
    this.tastingNotes = await (Capacitor.isNativePlatform()
      ? this.database.getAll()
      : firstValueFrom(this.api.getAll()));
  }

  async remove(note: TastingNote): Promise<void> {
    await (Capacitor.isNativePlatform() ? this.database.remove(note) : firstValueFrom(this.api.remove(note)));
    this.tastingNotes = this.tastingNotes?.filter((x) => x.id !== note.id);
  }

  async save(note: TastingNote): Promise<TastingNote> {
    const savedNote = await (Capacitor.isNativePlatform()
      ? this.database.save(note)
      : firstValueFrom(this.api.save(note)));
    if (this.tastingNotes) {
      const index = this.tastingNotes.findIndex((x) => x.id === savedNote.id);
      if (index >= 0) {
        this.tastingNotes[index] = savedNote;
      } else {
        this.tastingNotes.push(savedNote);
      }
    }
    return savedNote;
  }
}

import { TestBed } from '@angular/core/testing';
import { TastingNote } from '@app/models';
import { Platform } from '@ionic/angular';
import { createPlatformMock } from '@test/mocks';
import { of } from 'rxjs';
import { TastingNotesApiService } from '../tasting-notes-api/tasting-notes-api.service';
import { createTastingNotesApiServiceMock } from '../tasting-notes-api/tasting-notes-api.service.mock';
import { TastingNotesDatabaseService } from '../tasting-notes-database/tasting-notes-database.service';
import { createTastingNotesDatabaseServiceMock } from '../tasting-notes-database/tasting-notes-database.service.mock';

import { TastingNotesService } from './tasting-notes.service';

describe('TastingNotesService', () => {
  let service: TastingNotesService;
  let tastingNotes: Array<TastingNote>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Platform, useFactory: createPlatformMock },
        { provide: TastingNotesApiService, useFactory: createTastingNotesApiServiceMock },
        { provide: TastingNotesDatabaseService, useFactory: createTastingNotesDatabaseServiceMock },
      ],
    });
    initializeTestData();
    const tastingNotesApiService = TestBed.inject(TastingNotesApiService);
    const tastingNotesDatabaseService = TestBed.inject(TastingNotesDatabaseService);
    (tastingNotesApiService.getAll as jasmine.Spy).and.returnValue(of(tastingNotes));
    (tastingNotesDatabaseService.getAll as jasmine.Spy).and.returnValue(Promise.resolve(tastingNotes));
    service = TestBed.inject(TastingNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load', () => {
    describe('on mobile', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(true);
      });

      it('gets the tasting notes', async () => {
        const tastingNotesApiService = TestBed.inject(TastingNotesApiService);
        await service.loadDatabaseFromApi();
        expect(tastingNotesApiService.getAll).toHaveBeenCalledTimes(1);
      });

      it('prunes the notes in the database', async () => {
        const tastingNotesDatabaseService = TestBed.inject(TastingNotesDatabaseService);
        await service.loadDatabaseFromApi();
        expect(tastingNotesDatabaseService.pruneOthers).toHaveBeenCalledTimes(1);
        expect(tastingNotesDatabaseService.pruneOthers).toHaveBeenCalledWith(tastingNotes);
      });

      it('upserts each of the tasting notes', async () => {
        const tastingNotesDatabaseService = TestBed.inject(TastingNotesDatabaseService);
        await service.loadDatabaseFromApi();
        expect(tastingNotesDatabaseService.upsert).toHaveBeenCalledTimes(tastingNotes.length);
        tastingNotes.forEach((cat) => expect(tastingNotesDatabaseService.upsert).toHaveBeenCalledWith(cat));
      });
    });

    describe('on web', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(false);
      });

      it('does not interact with the database', async () => {
        const tastingNotesDatabaseService = TestBed.inject(TastingNotesDatabaseService);
        await service.loadDatabaseFromApi();
        expect(tastingNotesDatabaseService.getAll).not.toHaveBeenCalled();
        expect(tastingNotesDatabaseService.pruneOthers).not.toHaveBeenCalled();
        expect(tastingNotesDatabaseService.upsert).not.toHaveBeenCalled();
      });
    });
  });

  describe('refresh', () => {
    describe('on mobile', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(true);
      });

      it('gets the tasting notes from the database', async () => {
        const tastingNotesApiService = TestBed.inject(TastingNotesApiService);
        const tastingNotesDatabaseService = TestBed.inject(TastingNotesDatabaseService);
        await service.refresh();
        expect(tastingNotesDatabaseService.getAll).toHaveBeenCalledTimes(1);
        expect(tastingNotesApiService.getAll).not.toHaveBeenCalled();
      });

      it('caches the tasting notes data', async () => {
        await service.refresh();
        expect(service.data).toEqual(tastingNotes);
      });
    });

    describe('on web', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(false);
      });

      it('gets the tasting notes', async () => {
        const tastingNotesApiService = TestBed.inject(TastingNotesApiService);
        const tastingNotesDatabaseService = TestBed.inject(TastingNotesDatabaseService);
        await service.refresh();
        expect(tastingNotesDatabaseService.getAll).not.toHaveBeenCalled();
        expect(tastingNotesApiService.getAll).toHaveBeenCalledTimes(1);
      });

      it('caches the tasting notes data', async () => {
        await service.refresh();
        expect(service.data).toEqual(tastingNotes);
      });
    });
  });

  describe('find', () => {
    describe('on mobile', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(true);
      });

      it('gets the data if it is not cached', async () => {
        const tastingNotesDatabaseService = TestBed.inject(TastingNotesDatabaseService);
        await service.find(1);
        expect(tastingNotesDatabaseService.getAll).toHaveBeenCalledTimes(1);
        await service.find(2);
        expect(tastingNotesDatabaseService.getAll).toHaveBeenCalledTimes(1);
      });

      it('resolves the tasting note if it exists', async () => {
        const cat = await service.find(tastingNotes[2].id);
        expect(cat).toEqual(tastingNotes[2]);
      });

      it('resolves undefined if the tasting note does not exist', async () => {
        const cat = await service.find(73);
        expect(cat).toEqual(undefined);
      });
    });

    describe('on web', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(false);
      });

      it('gets the data if it is not cached', async () => {
        const tastingNotesApiService = TestBed.inject(TastingNotesApiService);
        service.find(1);
        await expect(tastingNotesApiService.getAll).toHaveBeenCalledTimes(1);
        service.find(2);
        await expect(tastingNotesApiService.getAll).toHaveBeenCalledTimes(1);
      });

      it('resolves the tasting note if it exists', async () => {
        const cat = await service.find(tastingNotes[2].id);
        expect(cat).toEqual(tastingNotes[2]);
      });

      it('resolves undefined if the tasting note does not exist', async () => {
        const cat = await service.find(73);
        expect(cat).toEqual(undefined);
      });
    });
  });

  describe('save', () => {
    beforeEach(async () => await service.refresh());

    describe('a new note', () => {
      const note: TastingNote = {
        brand: 'Lipton',
        name: 'Yellow Label',
        notes: 'Overly acidic, highly tannic flavor',
        rating: 1,
        teaCategoryId: 3,
      };

      describe('on mobile', () => {
        beforeEach(() => {
          const database = TestBed.inject(TastingNotesDatabaseService);
          const platform = TestBed.inject(Platform);
          (database.save as jasmine.Spy).and.returnValue(Promise.resolve({ id: 73, ...note }));
          (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(true);
        });

        it('saves the note to the database', async () => {
          const api = TestBed.inject(TastingNotesApiService);
          const database = TestBed.inject(TastingNotesDatabaseService);
          await service.save(note);
          expect(database.save).toHaveBeenCalledTimes(1);
          expect(database.save).toHaveBeenCalledWith(note);
          expect(api.save).not.toHaveBeenCalled();
        });

        it('resolves the saved note', async () => {
          expect(await service.save(note)).toEqual({ id: 73, ...note });
        });

        it('adds the note to the notes list', async () => {
          await service.save(note);
          expect(service.data.length).toEqual(4);
          expect(service.data[3]).toEqual({ id: 73, ...note });
        });
      });

      describe('on the web', () => {
        beforeEach(() => {
          const api = TestBed.inject(TastingNotesApiService);
          const platform = TestBed.inject(Platform);
          (api.save as jasmine.Spy).and.returnValue(of({ id: 73, ...note }));
          (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(false);
        });

        it('posts the new note', async () => {
          const api = TestBed.inject(TastingNotesApiService);
          const database = TestBed.inject(TastingNotesDatabaseService);
          await service.save(note);
          expect(api.save).toHaveBeenCalledTimes(1);
          expect(api.save).toHaveBeenCalledWith(note);
          expect(database.save).not.toHaveBeenCalled();
        });

        it('resolves the saved note', async () => {
          expect(await service.save(note)).toEqual({ id: 73, ...note });
        });

        it('adds the note to the notes list', async () => {
          await service.save(note);
          expect(service.data.length).toEqual(4);
          expect(service.data[3]).toEqual({ id: 73, ...note });
        });
      });
    });

    describe('an existing note', () => {
      const note: TastingNote = {
        id: 1,
        brand: 'Lipton',
        name: 'Green Tea',
        notes: 'Kinda like Lite beer. Dull, but well executed.',
        rating: 3,
        teaCategoryId: 1,
      };

      describe('on mobile', () => {
        beforeEach(() => {
          const database = TestBed.inject(TastingNotesDatabaseService);
          const platform = TestBed.inject(Platform);
          (database.save as jasmine.Spy).and.returnValue(Promise.resolve(note));
          (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(true);
        });

        it('save the note in the database', async () => {
          const api = TestBed.inject(TastingNotesApiService);
          const database = TestBed.inject(TastingNotesDatabaseService);
          await service.save(note);
          expect(database.save).toHaveBeenCalledTimes(1);
          expect(database.save).toHaveBeenCalledWith(note);
          expect(api.save).not.toHaveBeenCalled();
        });

        it('resolves the saved note', async () => {
          expect(await service.save(note)).toEqual(note);
        });

        it('update the note to the notes list', async () => {
          await service.save(note);
          expect(service.data.length).toEqual(3);
          expect(service.data[0]).toEqual(note);
        });
      });

      describe('on the web', () => {
        beforeEach(() => {
          const api = TestBed.inject(TastingNotesApiService);
          const platform = TestBed.inject(Platform);
          (api.save as jasmine.Spy).and.returnValue(of(note));
          (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(false);
        });

        it('saves the existing note', async () => {
          const api = TestBed.inject(TastingNotesApiService);
          const database = TestBed.inject(TastingNotesDatabaseService);
          await service.save(note);
          expect(api.save).toHaveBeenCalledTimes(1);
          expect(api.save).toHaveBeenCalledWith(note);
          expect(database.save).not.toHaveBeenCalled();
        });

        it('resolves the saved note', async () => {
          expect(await service.save(note)).toEqual(note);
        });

        it('updates the note in the notes list', async () => {
          await service.save(note);
          expect(service.data.length).toEqual(3);
          expect(service.data[0]).toEqual(note);
        });
      });
    });
  });

  describe('remove', () => {
    beforeEach(async () => await service.refresh());

    describe('on mobile', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(true);
      });

      it('marks the note for deletion', async () => {
        const api = TestBed.inject(TastingNotesApiService);
        const database = TestBed.inject(TastingNotesDatabaseService);
        const note = { ...tastingNotes[1] };
        await service.remove(tastingNotes[1]);
        expect(database.remove).toHaveBeenCalledTimes(1);
        expect(database.remove).toHaveBeenCalledWith(note);
        expect(api.remove).not.toHaveBeenCalled();
      });

      it('removes the note from the notes', async () => {
        const note = { ...tastingNotes[1] };
        await service.remove(note);
        expect(service.data.length).toEqual(2);
        expect(service.data[0].id).toEqual(1);
        expect(service.data[1].id).toEqual(42);
      });
    });

    describe('on the web', () => {
      beforeEach(() => {
        const api = TestBed.inject(TastingNotesApiService);
        (api.remove as jasmine.Spy).and.returnValue(of(null));
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(false);
      });

      it('removes the existing note', async () => {
        const api = TestBed.inject(TastingNotesApiService);
        const database = TestBed.inject(TastingNotesDatabaseService);
        const note = { ...tastingNotes[1] };
        await service.remove(note);
        expect(api.remove).toHaveBeenCalledTimes(1);
        expect(api.remove).toHaveBeenCalledWith(note);
        expect(database.remove).not.toHaveBeenCalled();
      });

      it('removes the note from the notes', async () => {
        const note = { ...tastingNotes[1] };
        await service.remove(note);
        expect(service.data.length).toEqual(2);
        expect(service.data[0].id).toEqual(1);
        expect(service.data[1].id).toEqual(42);
      });
    });
  });

  const initializeTestData = () => {
    tastingNotes = [
      {
        id: 1,
        brand: 'Lipton',
        name: 'Green',
        notes: 'Bland and dull, but better than their standard tea',
        rating: 2,
        teaCategoryId: 1,
      },
      {
        id: 3,
        brand: 'Rishi',
        name: 'Puer Tuo Cha',
        notes: 'Earthy with a bold a full flavor',
        rating: 5,
        teaCategoryId: 6,
      },
      {
        id: 42,
        brand: 'Rishi',
        name: 'Elderberry Healer',
        notes: 'Elderberry and ginger. Strong and healthy.',
        rating: 4,
        teaCategoryId: 7,
      },
    ];
  };
});

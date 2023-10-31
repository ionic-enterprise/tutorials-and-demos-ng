import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TastingNote } from '@app/models';
import { environment } from '@env/environment';

import { TastingNotesApiService } from './tasting-notes-api.service';

describe('TastingNotesApiService', () => {
  let httpTestingController: HttpTestingController;
  let service: TastingNotesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TastingNotesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get all', () => {
    it('gets the user tasting notes', () => {
      service.getAll().subscribe();
      const req = httpTestingController.expectOne(`${environment.dataService}/user-tasting-notes`);
      expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    });

    it('sorts the data by brand and name', () => {
      let result: Array<TastingNote>;
      service.getAll().subscribe((x) => (result = x));
      const req = httpTestingController.expectOne(`${environment.dataService}/user-tasting-notes`);
      req.flush([
        {
          id: 3,
          brand: 'Rishi',
          name: 'Puer Tuo Cha',
          notes: 'Earthy with a bold a full flavor',
          rating: 5,
          teaCategoryId: 6,
        },
        {
          id: 1,
          brand: 'Lipton',
          name: 'Green',
          notes: 'Bland and dull, but better than their standard tea',
          rating: 2,
          teaCategoryId: 1,
        },
        {
          id: 42,
          brand: 'Rishi',
          name: 'Elderberry Healer',
          notes: 'Elderberry and ginger. Strong and healthy.',
          rating: 4,
          teaCategoryId: 7,
        },
      ]);
      expect(result).toEqual([
        {
          id: 1,
          brand: 'Lipton',
          name: 'Green',
          notes: 'Bland and dull, but better than their standard tea',
          rating: 2,
          teaCategoryId: 1,
        },
        {
          id: 42,
          brand: 'Rishi',
          name: 'Elderberry Healer',
          notes: 'Elderberry and ginger. Strong and healthy.',
          rating: 4,
          teaCategoryId: 7,
        },
        {
          id: 3,
          brand: 'Rishi',
          name: 'Puer Tuo Cha',
          notes: 'Earthy with a bold a full flavor',
          rating: 5,
          teaCategoryId: 6,
        },
      ]);
    });
  });

  describe('remove', () => {
    it('deletes the specific note', () => {
      service
        .remove({
          id: 4,
          brand: 'Lipton',
          name: 'Orange Pekoe',
          notes: 'Gross with a lot of acidity',
          rating: 1,
          teaCategoryId: 2,
        })
        .subscribe();
      const req = httpTestingController.expectOne(`${environment.dataService}/user-tasting-notes/4`);
      expect(req.request.method).toEqual('DELETE');
      httpTestingController.verify();
    });
  });

  describe('save', () => {
    it('saves a new note', () => {
      service
        .save({
          brand: 'Lipton',
          name: 'Yellow Label',
          notes: 'Overly acidic, highly tannic flavor',
          rating: 1,
          teaCategoryId: 3,
        })
        .subscribe();
      const req = httpTestingController.expectOne(`${environment.dataService}/user-tasting-notes`);
      expect(req.request.method).toEqual('POST');
      httpTestingController.verify();
    });

    it('saves an existing note', () => {
      service
        .save({
          id: 7,
          brand: 'Lipton',
          name: 'Yellow Label',
          notes: 'Overly acidic, highly tannic flavor',
          rating: 1,
          teaCategoryId: 3,
        })
        .subscribe();
      const req = httpTestingController.expectOne(`${environment.dataService}/user-tasting-notes/7`);
      expect(req.request.method).toEqual('POST');
      httpTestingController.verify();
    });
  });
});

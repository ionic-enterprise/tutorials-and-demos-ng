import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TastingNotesService } from './tasting-notes.service';
import { environment } from '@env/environment';

describe('TastingNotesService', () => {
  let httpTestingController: HttpTestingController;
  let service: TastingNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TastingNotesService);
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
  });

  describe('delete', () => {
    it('removes the specific note', () => {
      service.delete(4).subscribe();
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

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TeaCategory } from '@app/models';
import { environment } from '@env/environment';

import { TeaCategoriesApiService } from './tea-categories-api.service';

describe('TeaCategoriesApiService', () => {
  let httpTestingController: HttpTestingController;
  let service: TeaCategoriesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TeaCategoriesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get all', () => {
    it('gets the tea categories', () => {
      service.getAll().subscribe();
      const req = httpTestingController.expectOne(`${environment.dataService}/tea-categories`);
      expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    });

    it('sorts the data by brand and name', () => {
      let result: Array<TeaCategory>;
      service.getAll().subscribe((x) => (result = x));
      const req = httpTestingController.expectOne(`${environment.dataService}/tea-categories`);
      req.flush([
        {
          id: 1,
          name: 'Green',
          description: 'Green tea description.',
        },
        {
          id: 2,
          name: 'Black',
          description: 'Black tea description.',
        },
        {
          id: 3,
          name: 'Herbal',
          description: 'Herbal Infusion description.',
        },
        {
          id: 4,
          name: 'Oolong',
          description: 'Oolong tea description.',
        },
        {
          id: 5,
          name: 'Dark',
          description: 'Dark tea description.',
        },
        {
          id: 6,
          name: 'Puer',
          description: 'Puer tea description.',
        },
        {
          id: 7,
          name: 'White',
          description: 'White tea description.',
        },
        {
          id: 8,
          name: 'Yellow',
          description: 'Yellow tea description.',
        },
      ]);
      expect(result).toEqual([
        {
          id: 2,
          name: 'Black',
          description: 'Black tea description.',
        },
        {
          id: 5,
          name: 'Dark',
          description: 'Dark tea description.',
        },
        {
          id: 1,
          name: 'Green',
          description: 'Green tea description.',
        },
        {
          id: 3,
          name: 'Herbal',
          description: 'Herbal Infusion description.',
        },
        {
          id: 4,
          name: 'Oolong',
          description: 'Oolong tea description.',
        },
        {
          id: 6,
          name: 'Puer',
          description: 'Puer tea description.',
        },
        {
          id: 7,
          name: 'White',
          description: 'White tea description.',
        },
        {
          id: 8,
          name: 'Yellow',
          description: 'Yellow tea description.',
        },
      ]);
    });
  });
});

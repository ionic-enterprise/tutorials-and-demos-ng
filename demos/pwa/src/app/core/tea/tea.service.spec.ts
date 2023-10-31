import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Tea } from '@app/models';
import { Preferences } from '@capacitor/preferences';
import { environment } from '@env/environment';

import { TeaService } from './tea.service';

describe('TeaService', () => {
  let httpTestingController: HttpTestingController;
  let service: TeaService;
  let expectedTeas: Array<Tea>;
  let resultTeas: Array<Omit<Tea, 'image' | 'rating'>>;

  beforeEach(() => {
    initializeTestData();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TeaService);
    spyOn(Preferences, 'get')
      .and.returnValue(Promise.resolve({ value: null }))
      .withArgs({ key: 'rating2' })
      .and.returnValue(Promise.resolve({ value: '2' }))
      .withArgs({ key: 'rating3' })
      .and.returnValue(Promise.resolve({ value: '4' }))
      .withArgs({ key: 'rating6' })
      .and.returnValue(Promise.resolve({ value: '5' }));
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

    it('adds an image to each', fakeAsync(() => {
      let teas: Array<Tea> = [];
      service.getAll().subscribe((t) => (teas = t));
      const req = httpTestingController.expectOne(`${environment.dataService}/tea-categories`);
      req.flush(resultTeas);
      tick();
      httpTestingController.verify();
      expect(teas).toEqual(expectedTeas);
    }));
  });

  describe('get', () => {
    it('gets the tea category', () => {
      service.get(3).subscribe();
      const req = httpTestingController.expectOne(`${environment.dataService}/tea-categories/3`);
      expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    });

    it('adds an image', fakeAsync(() => {
      let tea: Tea = expectedTeas[0];
      service.get(3).subscribe((t) => (tea = t));
      const req = httpTestingController.expectOne(`${environment.dataService}/tea-categories/3`);
      req.flush(resultTeas[2]);
      tick();
      httpTestingController.verify();
      expect(tea).toEqual(expectedTeas[2]);
    }));
  });

  describe('save', () => {
    it('saves the value', () => {
      spyOn(Preferences, 'set');
      const tea = { ...expectedTeas[4] };
      tea.rating = 4;
      service.save(tea);
      expect(Preferences.set).toHaveBeenCalledTimes(1);
      expect(Preferences.set).toHaveBeenCalledWith({
        key: 'rating5',
        value: '4',
      });
    });
  });

  const initializeTestData = () => {
    expectedTeas = [
      {
        id: 1,
        name: 'Green',
        image: 'assets/img/green.jpg',
        description: 'Green tea description.',
        rating: 0,
      },
      {
        id: 2,
        name: 'Black',
        image: 'assets/img/black.jpg',
        description: 'Black tea description.',
        rating: 2,
      },
      {
        id: 3,
        name: 'Herbal',
        image: 'assets/img/herbal.jpg',
        description: 'Herbal Infusion description.',
        rating: 4,
      },
      {
        id: 4,
        name: 'Oolong',
        image: 'assets/img/oolong.jpg',
        description: 'Oolong tea description.',
        rating: 0,
      },
      {
        id: 5,
        name: 'Dark',
        image: 'assets/img/dark.jpg',
        description: 'Dark tea description.',
        rating: 0,
      },
      {
        id: 6,
        name: 'Puer',
        image: 'assets/img/puer.jpg',
        description: 'Puer tea description.',
        rating: 5,
      },
      {
        id: 7,
        name: 'White',
        image: 'assets/img/white.jpg',
        description: 'White tea description.',
        rating: 0,
      },
      {
        id: 8,
        name: 'Yellow',
        image: 'assets/img/yellow.jpg',
        description: 'Yellow tea description.',
        rating: 0,
      },
    ];
    resultTeas = expectedTeas.map((t: Tea) => {
      const { image, rating, ...tea } = t;
      return tea;
    });
  };
});

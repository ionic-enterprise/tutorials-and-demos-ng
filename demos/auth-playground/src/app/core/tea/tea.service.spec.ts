import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Tea } from '@app/models';
import { environment } from '@env/environment';
import { TeaService } from './tea.service';

type TeaResponse = Omit<Tea, 'image'>;

describe('TeaService', () => {
  let expectedTeas: Array<Tea>;
  let resultTeas: Array<TeaResponse>;
  let httpTestingController: HttpTestingController;
  let service: TeaService;

  beforeEach(() => {
    initializeTestData();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TeaService);
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

    it('transforms each tea', fakeAsync(() => {
      let teas: Array<Tea> = [];
      service.getAll().subscribe((t) => (teas = t));
      const req = httpTestingController.expectOne(`${environment.dataService}/tea-categories`);
      req.flush(resultTeas);
      tick();
      httpTestingController.verify();
      expect(teas).toEqual(expectedTeas);
    }));
  });

  const initializeTestData = () => {
    expectedTeas = [
      {
        id: 1,
        name: 'Green',
        image: 'assets/img/green.jpg',
        description: 'Green tea description.',
      },
      {
        id: 2,
        name: 'Black',
        image: 'assets/img/black.jpg',
        description: 'Black tea description.',
      },
      {
        id: 3,
        name: 'Herbal',
        image: 'assets/img/herbal.jpg',
        description: 'Herbal Infusion description.',
      },
      {
        id: 4,
        name: 'Oolong',
        image: 'assets/img/oolong.jpg',
        description: 'Oolong tea description.',
      },
      {
        id: 5,
        name: 'Dark',
        image: 'assets/img/dark.jpg',
        description: 'Dark tea description.',
      },
      {
        id: 6,
        name: 'Puer',
        image: 'assets/img/puer.jpg',
        description: 'Puer tea description.',
      },
      {
        id: 7,
        name: 'White',
        image: 'assets/img/white.jpg',
        description: 'White tea description.',
      },
      {
        id: 8,
        name: 'Yellow',
        image: 'assets/img/yellow.jpg',
        description: 'Yellow tea description.',
      },
    ];
    resultTeas = expectedTeas.map((t: Tea) => {
      const { image, ...tea } = t;
      return tea;
    });
  };
});

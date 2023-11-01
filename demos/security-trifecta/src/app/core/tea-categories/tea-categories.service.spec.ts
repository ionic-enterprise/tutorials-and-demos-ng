import { TestBed } from '@angular/core/testing';
import { TeaCategory } from '@app/models';
import { Platform } from '@ionic/angular';
import { createPlatformMock } from '@test/mocks';
import { of } from 'rxjs';
import { TeaCategoriesApiService } from '../tea-categories-api/tea-categories-api.service';
import { createTeaCategoriesApiServiceMock } from '../tea-categories-api/tea-categories-api.service.mock';
import { TeaCategoriesDatabaseService } from '../tea-categories-database/tea-categories-database.service';
import { createTeaCategoriesDatabaseServiceMock } from '../tea-categories-database/tea-categories-database.service.mock';
import { TeaCategoriesService } from './tea-categories.service';

describe('TeaCategoriesService', () => {
  let service: TeaCategoriesService;
  let teaCategories: Array<TeaCategory>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Platform, useFactory: createPlatformMock },
        { provide: TeaCategoriesApiService, useFactory: createTeaCategoriesApiServiceMock },
        { provide: TeaCategoriesDatabaseService, useFactory: createTeaCategoriesDatabaseServiceMock },
      ],
    });
    initializeTestData();
    const teaCategoriesApiService = TestBed.inject(TeaCategoriesApiService);
    const teaCategoriesDatabaseService = TestBed.inject(TeaCategoriesDatabaseService);
    (teaCategoriesApiService.getAll as jasmine.Spy).and.returnValue(of(teaCategories));
    (teaCategoriesDatabaseService.getAll as jasmine.Spy).and.returnValue(Promise.resolve(teaCategories));
    service = TestBed.inject(TeaCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load database from API', () => {
    describe('on mobile', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(true);
      });

      it('gets the tea categories', async () => {
        const teaCategoriesApiService = TestBed.inject(TeaCategoriesApiService);
        await service.loadDatabaseFromApi();
        expect(teaCategoriesApiService.getAll).toHaveBeenCalledTimes(1);
      });

      it('prunes the tea categories in the database', async () => {
        const teaCategoriesDatabaseService = TestBed.inject(TeaCategoriesDatabaseService);
        await service.loadDatabaseFromApi();
        expect(teaCategoriesDatabaseService.pruneOthers).toHaveBeenCalledTimes(1);
        expect(teaCategoriesDatabaseService.pruneOthers).toHaveBeenCalledWith(teaCategories);
      });

      it('upserts each of the tea categories', async () => {
        const teaCategoriesDatabaseService = TestBed.inject(TeaCategoriesDatabaseService);
        await service.loadDatabaseFromApi();
        expect(teaCategoriesDatabaseService.upsert).toHaveBeenCalledTimes(teaCategories.length);
        teaCategories.forEach((cat) => expect(teaCategoriesDatabaseService.upsert).toHaveBeenCalledWith(cat));
      });
    });

    describe('on web', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(false);
      });

      it('does not interact with the database', async () => {
        const teaCategoriesDatabaseService = TestBed.inject(TeaCategoriesDatabaseService);
        await service.loadDatabaseFromApi();
        expect(teaCategoriesDatabaseService.getAll).not.toHaveBeenCalled();
        expect(teaCategoriesDatabaseService.pruneOthers).not.toHaveBeenCalled();
        expect(teaCategoriesDatabaseService.upsert).not.toHaveBeenCalled();
      });
    });
  });

  describe('refresh', () => {
    describe('on mobile', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(true);
      });

      it('gets the tea categories from the database', async () => {
        const teaCategoriesApiService = TestBed.inject(TeaCategoriesApiService);
        const teaCategoriesDatabaseService = TestBed.inject(TeaCategoriesDatabaseService);
        await service.refresh();
        expect(teaCategoriesDatabaseService.getAll).toHaveBeenCalledTimes(1);
        expect(teaCategoriesApiService.getAll).not.toHaveBeenCalled();
      });

      it('caches the tea categories data', async () => {
        await service.refresh();
        expect(service.data).toEqual(teaCategories);
      });
    });

    describe('on web', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(false);
      });

      it('gets the tea categories', async () => {
        const teaCategoriesApiService = TestBed.inject(TeaCategoriesApiService);
        const teaCategoriesDatabaseService = TestBed.inject(TeaCategoriesDatabaseService);
        await service.refresh();
        expect(teaCategoriesDatabaseService.getAll).not.toHaveBeenCalled();
        expect(teaCategoriesApiService.getAll).toHaveBeenCalledTimes(1);
      });

      it('caches the tea categories data', async () => {
        await service.refresh();
        expect(service.data).toEqual(teaCategories);
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
        const teaCategoriesDatabaseService = TestBed.inject(TeaCategoriesDatabaseService);
        await service.find(1);
        expect(teaCategoriesDatabaseService.getAll).toHaveBeenCalledTimes(1);
        await service.find(2);
        expect(teaCategoriesDatabaseService.getAll).toHaveBeenCalledTimes(1);
      });

      it('resolves the tea category if it exists', async () => {
        const cat = await service.find(teaCategories[2].id);
        expect(cat).toEqual(teaCategories[2]);
      });

      it('resolves undefined if the tea category does not exist', async () => {
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
        const teaCategoriesApiService = TestBed.inject(TeaCategoriesApiService);
        service.find(1);
        await expect(teaCategoriesApiService.getAll).toHaveBeenCalledTimes(1);
        service.find(2);
        await expect(teaCategoriesApiService.getAll).toHaveBeenCalledTimes(1);
      });

      it('resolves the tea category if it exists', async () => {
        const cat = await service.find(teaCategories[2].id);
        expect(cat).toEqual(teaCategories[2]);
      });

      it('resolves undefined if the tea category does not exist', async () => {
        const cat = await service.find(73);
        expect(cat).toEqual(undefined);
      });
    });
  });

  const initializeTestData = () => {
    teaCategories = [
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
    ];
  };
});

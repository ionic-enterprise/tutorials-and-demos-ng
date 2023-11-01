import { TestBed } from '@angular/core/testing';

import { CompareService } from './compare.service';

describe('CompareService', () => {
  let service: CompareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('by brand', () => {
    it('returns 0 if the brands are the same without regard to case', () => {
      const x = { id: 1, name: 'PueR', brand: 'RisHi' };
      const y = { id: 2, name: 'Radish', brand: 'rishi' };
      expect(service.byBrand(x, y)).toEqual(0);
    });

    it('returns -1 if x < y', () => {
      const x = { id: 1, name: 'PueR', brand: 'Lipton' };
      const y = { id: 2, name: 'PueR', brand: 'Rishi' };
      expect(service.byBrand(x, y)).toEqual(-1);
    });

    it('returns 1 if x > y', () => {
      const x = { id: 1, name: 'PueR', brand: 'Rishi' };
      const y = { id: 2, name: 'PueR', brand: 'Lipton' };
      expect(service.byBrand(x, y)).toEqual(1);
    });
  });

  describe('by name', () => {
    it('returns 0 if the names are the same without regard to case', () => {
      const x = { id: 1, name: 'TeD', description: 'likes to talk' };
      const y = { id: 2, name: 'ted', description: 'is a clown' };
      expect(service.byName(x, y)).toEqual(0);
    });

    it('returns -1 if x < y', () => {
      const x = { id: 1, name: 'sed', description: 'likes to talk' };
      const y = { id: 2, name: 'ted', description: 'is a clown' };
      const z = { id: 3, name: 'Ted', description: 'is a clown' };
      expect(service.byName(x, y)).toEqual(-1);
      expect(service.byName(x, z)).toEqual(-1);
    });

    it('returns 1 if x > y', () => {
      const x = { id: 1, name: 'ted', description: 'likes to talk' };
      const y = { id: 2, name: 'sed', description: 'is a clown' };
      const z = { id: 3, name: 'Sed', description: 'is a clown' };
      expect(service.byName(x, y)).toEqual(1);
      expect(service.byName(x, z)).toEqual(1);
    });
  });

  describe('by band and name', () => {
    it('returns 0 if the brands and names are the same without regard to case', () => {
      const x = { id: 1, name: 'PueR', brand: 'RisHi' };
      const y = { id: 2, name: 'puer', brand: 'rishi' };
      expect(service.byBrandAndName(x, y)).toEqual(0);
    });

    it('returns -1 if x < y, checking the brand first, name second', () => {
      const x = { id: 1, name: 'PueR', brand: 'RisHi' };
      const y = { id: 2, name: 'Red Label', brand: 'Lipton' };
      const z = { id: 3, name: 'Arabic', brand: 'RisHi' };
      expect(service.byBrandAndName(y, x)).toEqual(-1);
      expect(service.byBrandAndName(z, x)).toEqual(-1);
    });

    it('returns 1 if x > y, checking the brand first, name second', () => {
      const x = { id: 1, name: 'PueR', brand: 'Lipton' };
      const y = { id: 2, name: 'Red Label', brand: 'Lipton' };
      const z = { id: 3, name: 'Arabic', brand: 'RisHi' };
      expect(service.byBrandAndName(y, x)).toEqual(1);
      expect(service.byBrandAndName(z, x)).toEqual(1);
    });
  });
});

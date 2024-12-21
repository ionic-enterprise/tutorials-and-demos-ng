import { Injectable } from '@angular/core';

interface BrandNamePair {
  brand: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CompareService {
  byName(x1: Pick<BrandNamePair, 'name'>, x2: Pick<BrandNamePair, 'name'>): number {
    return this.byStringProp(x1, x2, 'name');
  }

  byBrand(x1: Pick<BrandNamePair, 'brand'>, x2: Pick<BrandNamePair, 'brand'>): number {
    return this.byStringProp(x1, x2, 'brand');
  }

  byBrandAndName(x1: BrandNamePair, x2: BrandNamePair): number {
    return this.byBrand(x1, x2) || this.byName(x1, x2);
  }

  private byStringProp(x1: Partial<BrandNamePair>, x2: Partial<BrandNamePair>, propName: 'brand' | 'name'): number {
    const str1 = x1[propName]?.trim().toUpperCase() || '';
    const str2 = x2[propName]?.trim().toUpperCase() || '';

    return str1.localeCompare(str2 || '');
  }
}

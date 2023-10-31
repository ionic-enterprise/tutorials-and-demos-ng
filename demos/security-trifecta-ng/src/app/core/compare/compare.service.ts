import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CompareService {
  constructor() {}

  byName(x1: { name: string }, x2: { name: string }): number {
    return this.byStringProp(x1, x2, 'name');
  }

  byBrand(x1: { brand: string }, x2: { brand: string }): number {
    return this.byStringProp(x1, x2, 'brand');
  }

  byBrandAndName(x1: { brand: string; name: string }, x2: { brand: string; name: string }): number {
    return this.byBrand(x1, x2) || this.byName(x1, x2);
  }

  private byStringProp(x1: any, x2: any, propName: string): number {
    const str1 = x1[propName].trim().toUpperCase();
    const str2 = x2[propName].trim().toUpperCase();

    return str1.localeCompare(str2);
  }
}

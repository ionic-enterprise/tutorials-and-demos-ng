import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TeaCategory } from '@app/models';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { CompareService } from '../compare/compare.service';

@Injectable({
  providedIn: 'root',
})
export class TeaCategoriesApiService {
  private compare = inject(CompareService);
  private http = inject(HttpClient);


  getAll(): Observable<TeaCategory[]> {
    return this.http
      .get<TeaCategory[]>(`${environment.dataService}/tea-categories`)
      .pipe(map((x) => x.sort((a, b) => this.compare.byName(a, b))));
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TastingNote } from '@app/models';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { CompareService } from '../compare/compare.service';

@Injectable({
  providedIn: 'root',
})
export class TastingNotesApiService {
  constructor(
    private compare: CompareService,
    private http: HttpClient,
  ) {}

  getAll(): Observable<Array<TastingNote>> {
    return this.http
      .get<Array<TastingNote>>(`${environment.dataService}/user-tasting-notes`)
      .pipe(map((x) => x.sort((a, b) => this.compare.byBrandAndName(a, b))));
  }

  remove(note: TastingNote): Observable<void> {
    return this.http.delete<void>(`${environment.dataService}/user-tasting-notes/${note.id}`);
  }

  save(note: TastingNote): Observable<TastingNote> {
    let url = `${environment.dataService}/user-tasting-notes`;
    if (note.id) {
      url += `/${note.id}`;
    }
    return this.http.post<TastingNote>(url, note);
  }
}

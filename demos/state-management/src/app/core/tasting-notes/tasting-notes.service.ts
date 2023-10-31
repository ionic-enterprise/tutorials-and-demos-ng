import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TastingNote } from '@app/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TastingNotesService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Array<TastingNote>> {
    return this.http.get<Array<TastingNote>>(`${environment.dataService}/user-tasting-notes`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.dataService}/user-tasting-notes/${id}`);
  }

  save(note: TastingNote): Observable<TastingNote> {
    let url = `${environment.dataService}/user-tasting-notes`;
    if (note.id) {
      url += `/${note.id}`;
    }
    return this.http.post<TastingNote>(url, note);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Tea } from '@app/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type TeaResponse = Omit<Tea, 'image'>;

@Injectable({
  providedIn: 'root',
})
export class TeaService {
  private http = inject(HttpClient);

  private images: string[] = ['green', 'black', 'herbal', 'oolong', 'dark', 'puer', 'white', 'yellow'];

  getAll(): Observable<Tea[]> {
    return this.http
      .get<TeaResponse[]>(`${environment.dataService}/tea-categories`)
      .pipe(map((teas: TeaResponse[]) => teas.map((t) => this.convert(t))));
  }

  private convert(t: TeaResponse): Tea {
    return {
      ...t,
      image: `assets/img/${this.images[t.id - 1]}.jpg`,
    };
  }
}

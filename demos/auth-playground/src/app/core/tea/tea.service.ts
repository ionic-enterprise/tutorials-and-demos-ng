import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tea } from '@app/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type TeaResponse = Omit<Tea, 'image'>;

@Injectable({
  providedIn: 'root',
})
export class TeaService {
  private images: Array<string> = ['green', 'black', 'herbal', 'oolong', 'dark', 'puer', 'white', 'yellow'];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Array<Tea>> {
    return this.http
      .get<Array<TeaResponse>>(`${environment.dataService}/tea-categories`)
      .pipe(map((teas: Array<TeaResponse>) => teas.map((t) => this.convert(t))));
  }

  private convert(t: TeaResponse): Tea {
    return {
      ...t,
      image: `assets/img/${this.images[t.id - 1]}.jpg`,
    };
  }
}

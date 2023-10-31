import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tea } from '@app/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class TeaService {
  private images: Array<string> = ['green', 'black', 'herbal', 'oolong', 'dark', 'puer', 'white', 'yellow'];

  constructor(private http: HttpClient) {}

  getAll(): Observable<Array<Tea>> {
    return this.http
      .get(`${environment.dataService}/tea-categories`)
      .pipe(mergeMap((teas: Array<any>) => Promise.all(teas.map((t) => this.convert(t)))));
  }

  save(tea: Tea): Promise<void> {
    return Preferences.set({
      key: `rating${tea.id}`,
      value: tea.rating.toString(),
    });
  }

  private async convert(t: any): Promise<Tea> {
    const { value } = await Preferences.get({ key: `rating${t.id}` });
    return {
      ...t,
      image: `assets/img/${this.images[t.id - 1]}.jpg`,
      rating: parseInt(value || '0', 10),
    };
  }
}

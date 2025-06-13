import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Tea } from '@app/models';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Preferences } from '@capacitor/preferences';

type TeaResponse = Omit<Tea, 'image' | 'rating'>;

@Injectable({
  providedIn: 'root',
})
export class TeaService {
  private http = inject(HttpClient);

  private images: string[] = ['green', 'black', 'herbal', 'oolong', 'dark', 'puer', 'white', 'yellow'];

  getAll(): Observable<Tea[]> {
    return this.http
      .get<TeaResponse[]>(`${environment.dataService}/tea-categories`)
      .pipe(mergeMap((teas: TeaResponse[]) => Promise.all(teas.map((t) => this.convert(t)))));
  }

  save(tea: Tea): Promise<void> {
    return Preferences.set({
      key: `rating${tea.id}`,
      value: tea.rating.toString(),
    });
  }

  private async convert(t: TeaResponse): Promise<Tea> {
    const { value } = await Preferences.get({ key: `rating${t.id}` });
    return {
      ...t,
      image: `assets/img/${this.images[t.id - 1]}.jpg`,
      rating: parseInt(value || '0', 10),
    };
  }
}

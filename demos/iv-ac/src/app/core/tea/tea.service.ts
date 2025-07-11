import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Tea } from '@app/models';
import { Preferences } from '@capacitor/preferences';
import { environment } from '@env/environment';
import { mergeMap, Observable } from 'rxjs';

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

  get(id: number): Observable<Tea> {
    // This is the part you will fill in once the tests are in place
    return this.http
      .get<TeaResponse>(`${environment.dataService}/tea-categories/${id}`)
      .pipe(mergeMap((tea) => this.convert(tea)));
  }

  save(tea: Tea): Promise<void> {
    return Preferences.set({
      key: `rating${tea.id}`,
      value: tea.rating.toString(),
    });
  }

  private async convert(tea: TeaResponse): Promise<Tea> {
    const { value } = await Preferences.get({ key: `rating${tea.id}` });
    return { ...tea, image: `assets/img/${this.images[tea.id - 1]}.jpg`, rating: parseInt(value || '0', 10) };
  }
}

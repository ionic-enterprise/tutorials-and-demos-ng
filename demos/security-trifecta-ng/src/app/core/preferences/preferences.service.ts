import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  private keys = {
    prefersDarkMode: 'prefersDarkMode',
  };

  private prefersDarkModeValue: boolean | null = null;
  private preferencesChanged: Subject<void>;

  constructor(private storage: StorageService) {
    this.preferencesChanged = new Subject();
  }

  get preferencesChanged$(): Observable<void> {
    return this.preferencesChanged.asObservable();
  }

  get prefersDarkMode(): boolean | null {
    return this.prefersDarkModeValue;
  }

  async load(): Promise<void> {
    this.prefersDarkModeValue = !!(await this.storage.get(this.keys.prefersDarkMode));
    this.preferencesChanged.next();
  }

  async setPrefersDarkMode(value: boolean): Promise<void> {
    this.prefersDarkModeValue = value;
    await this.storage.set(this.keys.prefersDarkMode, value);
    this.preferencesChanged.next();
  }
}

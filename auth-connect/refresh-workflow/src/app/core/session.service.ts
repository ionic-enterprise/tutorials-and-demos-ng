import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { AuthResult } from '@ionic-enterprise/auth';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private key = 'session';

  clear(): Promise<void> {
    return Preferences.remove({ key: this.key });
  }

  async getSession(): Promise<AuthResult | null> {
    const { value } = await Preferences.get({ key: this.key });
    return value ? JSON.parse(value) : null;
  }

  setSession(value: AuthResult): Promise<void> {
    return Preferences.set({ key: this.key, value: JSON.stringify(value) });
  }
}

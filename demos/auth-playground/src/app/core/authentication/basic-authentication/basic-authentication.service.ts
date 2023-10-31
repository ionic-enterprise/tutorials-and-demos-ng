import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { firstValueFrom } from 'rxjs';
import { SessionVaultService } from '../../session-vault/session-vault.service';
import { Authenticator } from '../authenticator';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Session {
  success: boolean;
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class BasicAuthenticationService implements Authenticator {
  constructor(
    private http: HttpClient,
    private vault: SessionVaultService,
  ) {}

  async login(email: string, password: string): Promise<void> {
    const { success, ...session } = await firstValueFrom(
      this.http.post<Session>(`${environment.dataService}/login`, { username: email, password }),
    );

    if (success) {
      return this.vault.setValue('session', session);
    } else {
      return Promise.reject(new Error('Login Failed'));
    }
  }

  async logout(): Promise<void> {
    await firstValueFrom(this.http.post(`${environment.dataService}/logout`, {}));
    return this.vault.clear();
  }

  async getAccessToken(): Promise<string | void> {
    const session = await this.vault.getValue('session');
    return session?.token;
  }

  async isAuthenticated(): Promise<boolean> {
    return !!(await this.getAccessToken());
  }
}

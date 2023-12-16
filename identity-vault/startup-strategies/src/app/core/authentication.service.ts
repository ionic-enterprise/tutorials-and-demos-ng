import { Injectable } from '@angular/core';
import { SessionVaultService } from './session-vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private sessionVault: SessionVaultService) {}

  async isAuthenticated(): Promise<boolean> {
    const session = await this.sessionVault.getSession();
    return !!session;
  }

  async login(): Promise<void> {
    this.sessionVault.storeSession({
      email: 'test@ionic.io',
      firstName: 'Tessa',
      lastName: 'Testsmith',
      accessToken: '4abf1d79-143c-4b89-b478-19607eb5ce97',
      refreshToken: '565111b6-66c3-4527-9238-6ea2cc017126',
    });
  }

  async logout(): Promise<void> {
    this.sessionVault.clearSession();
  }
}

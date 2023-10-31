import { Injectable } from '@angular/core';
import { AuthVendor } from '@app/models';
import { SessionVaultService } from '../../session-vault/session-vault.service';
import { Authenticator } from '../authenticator';
import { BasicAuthenticationService } from '../basic-authentication/basic-authentication.service';
import { OIDCAuthenticationService } from '../oidc-authentication/oidc-authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationExpediterService {
  constructor(
    private oidc: OIDCAuthenticationService,
    private basic: BasicAuthenticationService,
    private vault: SessionVaultService,
  ) {}

  async login(vendor: AuthVendor, credentials?: { email: string; password: string }): Promise<void> {
    await this.vault.setAuthVendor(vendor);
    const auth = this.getAuthService(vendor);
    if (auth) {
      if (credentials) {
        return auth.login(credentials.email, credentials.password);
      } else {
        return auth.login();
      }
    }
    return Promise.reject(new Error(`Invalid vendor: ${vendor}`));
  }

  async logout(): Promise<void> {
    const provider = await this.vault.getAuthVendor();
    const auth = this.getAuthService(provider);
    if (auth) {
      return auth.logout();
    }
    return Promise.reject(new Error(`Invalid vendor: ${provider}`));
  }

  async getAccessToken(): Promise<string | void> {
    const provider = await this.vault.getAuthVendor();
    const auth = this.getAuthService(provider);
    if (auth) {
      return auth.getAccessToken();
    }
    return Promise.reject(new Error(`Invalid vendor: ${provider}`));
  }

  async isAuthenticated(): Promise<boolean> {
    const provider = await this.vault.getAuthVendor();
    const auth = this.getAuthService(provider);
    return !!auth && (await auth.isAuthenticated());
  }

  private getAuthService(vendor: AuthVendor): Authenticator | null {
    switch (vendor) {
      case 'Auth0':
      case 'AWS':
      case 'Azure':
        this.oidc.setAuthProvider(vendor);
        return this.oidc;

      case 'Basic':
        return this.basic;

      default:
        return null;
    }
  }
}

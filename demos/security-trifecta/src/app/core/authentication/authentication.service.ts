import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Auth0Provider, AuthConnect, AuthResult, TokenType } from '@ionic-enterprise/auth';
import { Platform } from '@ionic/angular/standalone';
import { SessionVaultService } from '../session-vault/session-vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  initializing: Promise<void> | undefined;

  private provider: Auth0Provider;
  private isMobile: boolean;

  constructor(
    platform: Platform,
    private sessionVault: SessionVaultService,
  ) {
    this.provider = new Auth0Provider();
    this.isMobile = platform.is('hybrid');
  }

  initialize(): Promise<void> {
    return AuthConnect.setup({
      platform: this.isMobile ? 'capacitor' : 'web',
      logLevel: 'DEBUG',
      ios: {
        webView: 'private',
      },
      web: {
        uiMode: 'popup',
        authFlow: 'PKCE',
      },
    });
  }

  async login(): Promise<void> {
    const authResult = await AuthConnect.login(
      this.provider,
      this.isMobile ? environment.mobileAuthConfig : environment.webAuthConfig,
    );
    await this.sessionVault.setSession(authResult);
  }

  async logout(): Promise<void> {
    const authResult = await this.sessionVault.getSession();
    if (authResult) {
      await AuthConnect.logout(this.provider, authResult);
      await this.sessionVault.clearSession();
    }
    await this.sessionVault.resetUnlockMode();
  }

  async isAuthenticated(): Promise<boolean> {
    return !!(await this.getAuthResult());
  }

  async getAccessToken(): Promise<string | void> {
    const authResult = await this.getAuthResult();
    return authResult?.accessToken;
  }

  async getUserEmail(): Promise<string | void> {
    const authResult = await this.sessionVault.getSession();
    if (authResult) {
      const { email } = (await AuthConnect.decodeToken(TokenType.id, authResult)) as { email?: string };
      return email;
    }
  }

  private async performRefresh(authResult: AuthResult): Promise<AuthResult | null> {
    let newAuthResult: AuthResult | null = null;

    if (await AuthConnect.isRefreshTokenAvailable(authResult)) {
      try {
        newAuthResult = await AuthConnect.refreshSession(this.provider, authResult);
        this.sessionVault.setSession(newAuthResult);
      } catch {
        await this.sessionVault.clearSession();
      }
    } else {
      await this.sessionVault.clearSession();
    }

    return newAuthResult;
  }

  private async getAuthResult(): Promise<AuthResult | null> {
    let authResult = await this.sessionVault.getSession();
    if (authResult && (await AuthConnect.isAccessTokenExpired(authResult))) {
      authResult = await this.performRefresh(authResult);
    }
    return authResult;
  }
}

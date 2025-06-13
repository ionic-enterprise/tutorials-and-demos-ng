import { Injectable, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Auth0Provider, AuthConnect, AuthResult, ProviderOptions } from '@ionic-enterprise/auth';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private session = inject(SessionService);

  private authOptions: ProviderOptions;
  private provider: Auth0Provider;

  constructor() {
    const isNative = Capacitor.isNativePlatform();
    this.provider = new Auth0Provider();
    this.authOptions = {
      audience: 'https://io.ionic.demo.ac',
      clientId: 'yLasZNUGkZ19DGEjTmAITBfGXzqbvd00',
      discoveryUrl: 'https://dev-2uspt-sz.us.auth0.com/.well-known/openid-configuration',
      logoutUrl: isNative ? 'io.ionic.acdemo://auth-action-complete' : 'http://localhost:8100/auth-action-complete',
      redirectUri: isNative ? 'io.ionic.acdemo://auth-action-complete' : 'http://localhost:8100/auth-action-complete',
      scope: 'openid offline_access email picture profile',
    };
  }

  initialize(): Promise<void> {
    const isNative = Capacitor.isNativePlatform();
    return AuthConnect.setup({
      platform: isNative ? 'capacitor' : 'web',
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

  async isAuthenticated(): Promise<boolean> {
    const authResult = await this.getAuthResult();
    return !!authResult && (await AuthConnect.isAccessTokenAvailable(authResult));
  }

  async login(): Promise<void> {
    const authResult = await AuthConnect.login(this.provider, this.authOptions);
    this.saveAuthResult(authResult);
  }

  async logout(): Promise<void> {
    const authResult = await this.getAuthResult();
    if (authResult) {
      await AuthConnect.logout(this.provider, authResult);
      this.saveAuthResult(null);
    }
  }

  private async getAuthResult(): Promise<AuthResult | null> {
    let authResult = await this.session.getSession();
    if (
      authResult &&
      (await AuthConnect.isAccessTokenAvailable(authResult)) &&
      (await AuthConnect.isAccessTokenExpired(authResult))
    ) {
      authResult = await this.refreshAuthResult(authResult);
    }
    return authResult;
  }

  private async refreshAuthResult(authResult: AuthResult): Promise<AuthResult | null> {
    let newAuthResult: AuthResult | null = null;
    if (await AuthConnect.isRefreshTokenAvailable(authResult)) {
      try {
        newAuthResult = await AuthConnect.refreshSession(this.provider, authResult);
      } catch (err: unknown) {
        console.error(err);
      }
    }
    await this.saveAuthResult(newAuthResult);
    return newAuthResult;
  }

  private async saveAuthResult(authResult: AuthResult | null): Promise<void> {
    if (authResult) {
      await this.session.setSession(authResult);
    } else {
      await this.session.clear();
    }
  }
}

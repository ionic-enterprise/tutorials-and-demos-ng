import { Injectable } from '@angular/core';
import { Auth0Provider, AuthConnect, AuthResult, ProviderOptions } from '@ionic-enterprise/auth';
import { Platform } from '@ionic/angular';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private authOptions: ProviderOptions;
  private provider: Auth0Provider;
  private isReady: Promise<void>;

  constructor(
    platform: Platform,
    private session: SessionService,
  ) {
    const isNative = platform.is('hybrid');
    this.provider = new Auth0Provider();
    this.authOptions = {
      audience: 'https://io.ionic.demo.ac',
      clientId: 'yLasZNUGkZ19DGEjTmAITBfGXzqbvd00',
      discoveryUrl: 'https://dev-2uspt-sz.us.auth0.com/.well-known/openid-configuration',
      logoutUrl: isNative ? 'msauth://login' : 'http://localhost:8100/login',
      redirectUri: isNative ? 'msauth://login' : 'http://localhost:8100/login',
      scope: 'openid offline_access email picture profile',
    };

    this.isReady = AuthConnect.setup({
      platform: isNative ? 'capacitor' : 'web',
      logLevel: 'DEBUG',
      ios: {
        webView: 'private',
      },
      web: {
        uiMode: 'popup',
        authFlow: 'implicit',
      },
    });
  }

  async isAuthenticated(): Promise<boolean> {
    const authResult = await this.getAuthResult();
    return !!authResult;
  }

  async login(): Promise<void> {
    await this.isReady;
    const authResult = await AuthConnect.login(this.provider, this.authOptions);
    this.saveAuthResult(authResult);
  }

  async logout(): Promise<void> {
    await this.isReady;
    const authResult = await this.getAuthResult();
    if (authResult) {
      await AuthConnect.logout(this.provider, authResult);
      this.saveAuthResult(null);
    }
  }

  private async getAuthResult(): Promise<AuthResult | null> {
    return this.session.getSession();
  }

  private async saveAuthResult(authResult: AuthResult | null): Promise<void> {
    if (authResult) {
      await this.session.setSession(authResult);
    } else {
      await this.session.clear();
    }
  }
}

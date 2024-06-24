import { Injectable, NgZone, isDevMode } from '@angular/core';
import { Auth0Provider, AuthConnect, AuthResult, ProviderOptions } from '@ionic-enterprise/auth';
import { Platform } from '@ionic/angular/standalone';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionVaultService } from '../session-vault/session-vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private isNative;
  private authOptions: ProviderOptions;
  private provider = new Auth0Provider();

  private authenticationChange: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public authenticationChange$: Observable<boolean>;

  constructor(
    private ngZone: NgZone,
    private sessionVault: SessionVaultService,
    platform: Platform,
  ) {
    this.isNative = platform.is('hybrid');
    const url = this.isNative
      ? 'io.ionic.teataster://auth-action-complete'
      : isDevMode()
        ? 'http://localhost:8100/auth-action-complete'
        : 'https://tea-taster-ng.web.app/auth-action-complete';

    this.authOptions = {
      audience: 'https://io.ionic.demo.ac',
      clientId: 'yLasZNUGkZ19DGEjTmAITBfGXzqbvd00',
      discoveryUrl: 'https://dev-2uspt-sz.us.auth0.com/.well-known/openid-configuration',
      scope: 'openid email picture profile offline_access',
      logoutUrl: url,
      redirectUri: url,
    };

    this.authenticationChange$ = this.authenticationChange.asObservable();
  }

  initialize(): Promise<void> {
    return AuthConnect.setup({
      platform: this.isNative ? 'capacitor' : 'web',
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

  public async login(): Promise<void> {
    const authResult = await AuthConnect.login(this.provider, this.authOptions);
    await this.saveAuthResult(authResult);
  }

  public async logout(): Promise<void> {
    let authResult = await this.getAuthResult();
    if (!authResult) {
      authResult = await AuthConnect.buildAuthResult(this.provider, this.authOptions, {});
    }
    await AuthConnect.logout(this.provider, authResult);
    await this.saveAuthResult(null);
  }

  private async onAuthChange(isAuthenticated: boolean): Promise<void> {
    this.ngZone.run(() => {
      this.authenticationChange.next(isAuthenticated);
    });
  }

  public async getAuthResult(): Promise<AuthResult | null> {
    let authResult = await this.sessionVault.getSession();
    if (authResult && (await AuthConnect.isAccessTokenExpired(authResult))) {
      authResult = await this.refreshAuth(authResult);
    }
    return authResult;
  }

  public async isAuthenticated(): Promise<boolean> {
    return !!(await this.getAuthResult());
  }

  public async getAccessToken(): Promise<string | undefined> {
    const res = await this.getAuthResult();
    return res?.accessToken;
  }

  public async refreshAuth(authResult: AuthResult): Promise<AuthResult | null> {
    let newAuthResult: AuthResult | null = null;
    if (await AuthConnect.isRefreshTokenAvailable(authResult)) {
      try {
        newAuthResult = await AuthConnect.refreshSession(this.provider, authResult);
      } catch (err) {
        null;
      }

      this.saveAuthResult(newAuthResult);
    }

    this.saveAuthResult(null);
    return newAuthResult;
  }

  private async saveAuthResult(authResult: AuthResult | null): Promise<void> {
    if (authResult) {
      await this.sessionVault.setSession(authResult);
    } else {
      await this.sessionVault.clear();
    }

    this.onAuthChange(!!authResult);
  }
}

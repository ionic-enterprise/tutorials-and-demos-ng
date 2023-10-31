import { Injectable, NgZone, isDevMode } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { AuthConnect, AuthResult, CognitoProvider, ProviderOptions } from '@ionic-enterprise/auth';
import { SessionVaultService } from '../session-vault/session-vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private initializing: Promise<void> | undefined;
  private isNative;
  private authOptions: ProviderOptions;
  private provider = new CognitoProvider();

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
      clientId: '64p9c53l5thd5dikra675suvq9',
      discoveryUrl: 'https://cognito-idp.us-east-2.amazonaws.com/us-east-2_YU8VQe29z/.well-known/openid-configuration',
      logoutUrl: url,
      redirectUri: url,
      scope: 'openid email profile',
      audience: '',
    };

    this.initialize();
    this.authenticationChange$ = this.authenticationChange.asObservable();
  }

  private setup(): Promise<void> {
    return AuthConnect.setup({
      platform: this.isNative ? 'capacitor' : 'web',
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

  private initialize(): Promise<void> {
    if (!this.initializing) {
      this.initializing = new Promise((resolve) => {
        this.setup().then(() => resolve());
      });
    }

    return this.initializing;
  }

  public async login(): Promise<void> {
    await this.initialize();
    const authResult = await AuthConnect.login(this.provider, this.authOptions);
    await this.saveAuthResult(authResult);
  }

  public async logout(): Promise<void> {
    await this.initialize();
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
    await this.initialize();
    return !!(await this.getAuthResult());
  }

  public async getAccessToken(): Promise<string | undefined> {
    await this.initialize();
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

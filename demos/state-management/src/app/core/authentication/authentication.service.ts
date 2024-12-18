import { Injectable, NgZone } from '@angular/core';
import { User } from '@app/models';
import { mobileAuthConfig, webAuthConfig } from '@env/environment';
import { Auth0Provider, AuthConnect, AuthResult, ProviderOptions, TokenType } from '@ionic-enterprise/auth';
import { Platform } from '@ionic/angular/standalone';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionVaultService } from '../session-vault/session-vault.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public authenticationChange$: Observable<boolean>;
  private authenticationChange = new BehaviorSubject<boolean>(false);

  private readonly provider = new Auth0Provider();

  private isNative;
  private authOptions: ProviderOptions;
  private authResult: AuthResult | null = null;
  private vaultService: SessionVaultService;
  private initializing: Promise<void> | undefined;

  constructor(
    vaultService: SessionVaultService,
    platform: Platform,
    private ngZone: NgZone,
  ) {
    this.isNative = platform.is('hybrid');
    this.authOptions = this.isNative ? mobileAuthConfig : webAuthConfig;
    this.vaultService = vaultService;

    this.authenticationChange$ = this.authenticationChange.asObservable();
  }

  public initialize(): Promise<void> {
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
    this.authResult = await AuthConnect.login(this.provider, this.authOptions);
    await this.saveAuthResult(this.authResult);
  }

  public async logout(): Promise<void> {
    if (this.authResult) {
      await AuthConnect.logout(this.provider, this.authResult);
      this.authResult = null;
      await this.saveAuthResult(null);
    }
  }

  public async refreshAuth(authResult: AuthResult): Promise<AuthResult | null> {
    let newAuthResult: AuthResult | null = null;
    if (await AuthConnect.isRefreshTokenAvailable(authResult)) {
      try {
        newAuthResult = await AuthConnect.refreshSession(this.provider, authResult);
      } catch (err) {
        console.error(err);
      }
    }
    this.saveAuthResult(newAuthResult);
    return newAuthResult;
  }

  public async getAuthResult(): Promise<AuthResult | null> {
    this.authResult = await this.vaultService.getSession();
    if (this.authResult && (await AuthConnect.isAccessTokenExpired(this.authResult))) {
      this.authResult = await this.refreshAuth(this.authResult);
    }

    return this.authResult;
  }

  public async isAuthenticated(): Promise<boolean> {
    return !!(await this.getAuthResult());
  }

  public async getAccessToken(): Promise<string | undefined> {
    const res = await this.getAuthResult();
    return res?.accessToken;
  }

  async getUserInfo(): Promise<User | undefined> {
    const res = await this.getAuthResult();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const idToken = (await AuthConnect.decodeToken(TokenType.id, res as AuthResult)) as any;
    if (!idToken) {
      return;
    }

    let email = idToken.email;
    if (idToken.emails instanceof Array) {
      email = idToken.emails[0];
    }

    return {
      id: idToken.sub,
      email,
      firstName: idToken.firstName,
      lastName: idToken.lastName,
    };
  }

  private async onAuthChange(isAuthenticated: boolean): Promise<void> {
    this.ngZone.run(() => {
      this.authenticationChange.next(isAuthenticated);
    });
  }

  private async saveAuthResult(authResult: AuthResult | null): Promise<void> {
    if (authResult) {
      await this.vaultService.setSession(authResult);
    } else {
      await this.vaultService.clearSession();
    }
    this.onAuthChange(!!authResult);
  }
}

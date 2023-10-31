import { Injectable } from '@angular/core';
import { SessionVaultService } from '@app/core/session-vault/session-vault.service';
import { AuthVendor } from '@app/models';
import { environment } from '@env/environment';
import {
  Auth0Provider,
  AuthConnect,
  AuthResult,
  AzureProvider,
  CognitoProvider,
  ProviderOptions,
} from '@ionic-enterprise/auth';
import { Platform } from '@ionic/angular';
import { Authenticator } from '../authenticator';

@Injectable({
  providedIn: 'root',
})
export class OIDCAuthenticationService implements Authenticator {
  private authResultKey = 'auth-result';
  private initializing: Promise<void>;
  private options: ProviderOptions = null;
  private provider: Auth0Provider | AzureProvider | CognitoProvider | null = null;

  constructor(
    private sessionVault: SessionVaultService,
    private platform: Platform,
  ) {
    this.initialize();
  }

  setAuthProvider(vendor: AuthVendor): void {
    if (vendor === 'Auth0') {
      this.options = this.handleWebOptions(environment.auth0Config);
      this.provider = new Auth0Provider();
    } else if (vendor === 'AWS') {
      this.options = this.handleWebOptions(environment.awsConfig);
      this.provider = new CognitoProvider();
    } else {
      this.options = this.handleWebOptions(environment.azureConfig);
      this.provider = new AzureProvider();
    }
  }

  async login(): Promise<void> {
    await this.initialize();
    try {
      const res = await AuthConnect.login(this.provider, this.options);
      this.sessionVault.setValue(this.authResultKey, res);
    } catch (err) {
      // eslint-disable-next-line
      console.log('login error:', err);
      const message: string = err.errorMessage;
      if (
        this.options.clientId === environment.azureConfig.clientId &&
        message !== undefined &&
        message.includes('AADB2C90118')
      ) {
        // This is to handle the password reset case for Azure AD and is only applicable to Azure  AD
        // The address you pass back is the custom user flow (policy) endpoint
        const res = await AuthConnect.login(this.provider, {
          ...this.options,
          discoveryUrl:
            'https://dtjacdemo.b2clogin.com/dtjacdemo.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_password_reset',
        });
        this.sessionVault.setValue(this.authResultKey, res);
      } else {
        throw new Error(err.error);
      }
    }
  }

  async isAuthenticated(): Promise<boolean> {
    await this.initialize();
    return !!(await this.getAuthResult());
  }

  async getAccessToken(): Promise<string | void> {
    await this.initialize();
    const res = await this.getAuthResult();
    return res?.accessToken;
  }

  async logout(): Promise<void> {
    await this.initialize();
    const res = (await this.getAuthResult()) || (await AuthConnect.buildAuthResult(this.provider, this.options, {}));
    if (res) {
      await AuthConnect.logout(this.provider, res);
      await this.sessionVault.clear();
    }
  }

  private handleWebOptions(opt: ProviderOptions): ProviderOptions {
    const urls = this.platform.is('hybrid')
      ? {}
      : {
          redirectUri: environment.webRedirects.redirectUri,
          logoutUrl: environment.webRedirects.logoutUrl,
        };

    return {
      ...opt,
      ...urls,
    };
  }

  private initialize(): Promise<void> {
    if (!this.initializing) {
      this.initializing = new Promise((resolve) => {
        this.performInit().then(() => resolve());
      });
    }
    return this.initializing;
  }

  private async performInit(): Promise<void> {
    await AuthConnect.setup({
      platform: this.platform.is('hybrid') ? 'capacitor' : 'web',
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

  private async getAuthResult(): Promise<AuthResult | undefined> {
    let authResult = (await this.sessionVault.getValue(this.authResultKey)) as AuthResult | undefined;
    if (authResult && (await AuthConnect.isAccessTokenExpired(authResult))) {
      authResult = await this.performRefresh(authResult);
    }
    return authResult;
  }

  private async performRefresh(authResult: AuthResult): Promise<AuthResult | undefined> {
    let newAuthResult: AuthResult | undefined;

    if (await AuthConnect.isRefreshTokenAvailable(authResult)) {
      try {
        newAuthResult = await AuthConnect.refreshSession(this.provider, authResult);
        this.sessionVault.setValue(this.authResultKey, newAuthResult);
      } catch (err) {
        await this.sessionVault.clear();
      }
    } else {
      await this.sessionVault.clear();
    }

    return newAuthResult;
  }
}

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { routes } from '@app/app.routes';
import {
  AuthenticationService,
  EncryptionService,
  SessionVaultService,
  authInterceptor,
  unauthInterceptor,
} from '@app/core';
import { KeyValueStorage, SQLite } from '@ionic-enterprise/secure-storage/ngx';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const appInitFactory =
  (
    auth: AuthenticationService,
    encryption: EncryptionService,
    sessionVault: SessionVaultService,
  ): (() => Promise<void>) =>
  async () => {
    await auth.initialize();
    await encryption.initialize();
    await sessionVault.initialize();
  };

bootstrapApplication(AppComponent, {
  providers: [
    KeyValueStorage,
    SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideAppInitializer(() => {
      const initializerFn = appInitFactory(
        inject(AuthenticationService),
        inject(EncryptionService),
        inject(SessionVaultService),
      );
      return initializerFn();
    }),
    provideHttpClient(withInterceptors([authInterceptor, unauthInterceptor])),
    provideRouter(routes),
    provideIonicAngular({}),
  ],
});

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { routes } from '@app/app.routes';
import { SessionVaultService, authInterceptor, unauthInterceptor } from '@app/core';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { environment } from './environments/environment';
import { OIDCAuthenticationService } from '@app/core/authentication/oidc-authentication/oidc-authentication.service';

if (environment.production) {
  enableProdMode();
}

const appInitFactory =
  (auth: OIDCAuthenticationService, sessionVault: SessionVaultService): (() => Promise<void>) =>
  async () => {
    await auth.initialize();
    await sessionVault.initialize();
  };

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideAppInitializer(() => {
      const initializerFn = appInitFactory(inject(OIDCAuthenticationService), inject(SessionVaultService));
      return initializerFn();
    }),
    provideHttpClient(withInterceptors([authInterceptor, unauthInterceptor])),
    provideRouter(routes),
    provideIonicAngular({}),
  ],
});

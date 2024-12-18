import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { routes } from '@app/app.routes';
import { AuthenticationService, SessionVaultService, authInterceptor, unauthInterceptor } from '@app/core';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const appInitFactory =
  (authentication: AuthenticationService, sessionVault: SessionVaultService): (() => Promise<void>) =>
  async () => {
    await authentication.initialize();
    await sessionVault.initialize();
  };

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideAppInitializer(() => {
      const initializerFn = appInitFactory(inject(AuthenticationService), inject(SessionVaultService));
      return initializerFn();
    }),
    provideHttpClient(withInterceptors([authInterceptor, unauthInterceptor])),
    provideRouter(routes),
    provideIonicAngular({}),
  ],
});

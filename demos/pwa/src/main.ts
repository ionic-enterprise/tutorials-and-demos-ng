import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { AppComponent } from '@app/app.component';
import { routes } from '@app/app.routes';
import { AuthInterceptor, SessionVaultService, UnauthInterceptor } from '@app/core';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const appInitFactory =
  (sessionVault: SessionVaultService): (() => Promise<void>) =>
  async () => {
    await sessionVault.initialize();
  };

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: appInitFactory, deps: [SessionVaultService], multi: true },
    importProvidersFrom(HttpClientModule),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideIonicAngular({}),
  ],
});

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { enableProdMode, inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { routes } from '@app/app.routes';
import { AuthenticationService, SessionVaultService, authInterceptor, unauthInterceptor } from '@app/core';
import { metaReducers, reducers } from '@app/store';
import { AuthEffects, DataEffects } from '@app/store/effects';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const appInitFactory =
  (auth: AuthenticationService, sessionVault: SessionVaultService): (() => Promise<void>) =>
  async () => {
    await auth.initialize();
    await sessionVault.initialize();
  };

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideAppInitializer(() => {
      const initializerFn = appInitFactory(inject(AuthenticationService), inject(SessionVaultService));
      return initializerFn();
    }),
    provideStore(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    provideEffects([AuthEffects, DataEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production,
      autoPause: true,
    }),
    provideHttpClient(withInterceptors([authInterceptor, unauthInterceptor])),
    provideRouter(routes),
    provideIonicAngular({}),
  ],
});

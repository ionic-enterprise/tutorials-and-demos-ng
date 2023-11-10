import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { routes } from '@app/app.routes';
import { AuthInterceptor, SessionVaultService, UnauthInterceptor } from '@app/core';
import { metaReducers, reducers } from '@app/store';
import { AuthEffects, DataEffects } from '@app/store/effects';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
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
    importProvidersFrom(
      HttpClientModule,
      StoreModule.forRoot(reducers, {
        metaReducers,
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
        },
      }),
      EffectsModule.forRoot([AuthEffects, DataEffects]),
      StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production, autoPause: true }),
    ),
    provideRouter(routes),
    provideIonicAngular({}),
  ],
});

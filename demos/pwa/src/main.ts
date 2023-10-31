import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, importProvidersFrom, isDevMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { routes } from '@app/app.routes';
import { AuthInterceptor, UnauthInterceptor } from '@app/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { environment } from './environments/environment';
import { provideServiceWorker } from '@angular/service-worker';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UnauthInterceptor, multi: true },
    importProvidersFrom(HttpClientModule, IonicModule.forRoot({})),
    provideRouter(routes),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
});

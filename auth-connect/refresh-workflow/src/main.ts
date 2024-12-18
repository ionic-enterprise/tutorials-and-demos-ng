import { enableProdMode, inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthenticationService } from './app/core/authentication.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const appInitFactory =
  (auth: AuthenticationService): (() => Promise<void>) =>
  async () => {
    await auth.initialize();
  };

bootstrapApplication(AppComponent, {
  providers: [
    provideAppInitializer(() => {
      const initializerFn = appInitFactory(inject(AuthenticationService));
      return initializerFn();
    }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideRouter(routes),
    provideIonicAngular({}),
  ],
});

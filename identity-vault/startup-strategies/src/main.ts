import { enableProdMode, inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { SessionVaultService } from './app/core/session-vault.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

const appInitFactory =
  (vault: SessionVaultService): (() => Promise<void>) =>
  async () => {
    await vault.initialize();
  };

bootstrapApplication(AppComponent, {
  providers: [
    provideAppInitializer(() => {
      const initializerFn = appInitFactory(inject(SessionVaultService));
      return initializerFn();
    }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
  ],
});

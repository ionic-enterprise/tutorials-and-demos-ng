import { APP_INITIALIZER, enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { SessionVaultService } from './app/core/session-vault.service';
import { environment } from './environments/environment';
import { Device } from '@ionic-enterprise/identity-vault';

if (environment.production) {
  enableProdMode();
}

const appInitFactory =
  (vault: SessionVaultService): (() => Promise<void>) =>
  async () => {
    await vault.initialize();
    await Device.setHideScreenOnBackground(true);
  };

bootstrapApplication(AppComponent, {
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitFactory, deps: [SessionVaultService], multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
  ],
});

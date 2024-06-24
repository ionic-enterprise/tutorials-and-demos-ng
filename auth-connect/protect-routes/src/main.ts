import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { AuthenticationService } from './app/core/authentication.service';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { unauthInterceptor } from './app/core/interceptors/unauth.interceptor';
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
    { provide: APP_INITIALIZER, useFactory: appInitFactory, deps: [AuthenticationService], multi: true },
    provideHttpClient(withInterceptors([authInterceptor, unauthInterceptor])),
    provideRouter(routes),
    provideIonicAngular({}),
  ],
});

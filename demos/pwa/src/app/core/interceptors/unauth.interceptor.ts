import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { SessionVaultService } from '../session-vault/session-vault.service';
import { NavController } from '@ionic/angular';

@Injectable()
export class UnauthInterceptor implements HttpInterceptor {
  constructor(
    private navController: NavController,
    private sessionVault: SessionVaultService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<unknown>) => {},
        async (err: unknown) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            await this.sessionVault.clear();
            this.navController.navigateRoot(['/', 'login']);
          }
        },
      ),
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { from, mergeMap, Observable, tap } from 'rxjs';
import { SessionVaultService } from '../session-vault/session-vault.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private sessionVault: SessionVaultService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this.sessionVault.get()).pipe(
      tap((session) => {
        if (session && this.requestRequiresToken(request)) {
          request = request.clone({
            setHeaders: {
              Authorization: 'Bearer ' + session.token,
            },
          });
        }
      }),
      mergeMap(() => next.handle(request)),
    );
  }

  private requestRequiresToken(req: HttpRequest<any>): boolean {
    return !/\/login$/.test(req.url);
  }
}

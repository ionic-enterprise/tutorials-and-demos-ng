import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { from, mergeMap, Observable, tap } from 'rxjs';
import { SessionVaultService } from '../session-vault/session-vault.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(
      this.requestRequiresToken(request)
        ? this.auth.getAccessToken().then((token) => {
            if (token) {
              request = request.clone({
                setHeaders: {
                  Authorization: 'Bearer ' + token,
                },
              });
            }
          })
        : Promise.resolve(),
    ).pipe(mergeMap(() => next.handle(request)));
  }

  private requestRequiresToken(req: HttpRequest<any>): boolean {
    return !/\/login$/.test(req.url);
  }
}

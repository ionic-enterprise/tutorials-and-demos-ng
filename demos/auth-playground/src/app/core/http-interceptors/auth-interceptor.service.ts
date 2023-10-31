import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationExpediterService } from '../authentication/authentication-expediter/authentication-expediter.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationExpediterService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(
      this.requestRequiresToken(req)
        ? this.auth.getAccessToken().then((token) => {
            if (token) {
              req = req.clone({
                setHeaders: {
                  Authorization: 'Bearer ' + token,
                },
              });
            }
          })
        : Promise.resolve(),
    ).pipe(mergeMap(() => next.handle(req)));
  }

  private requestRequiresToken(req: HttpRequest<any>): boolean {
    return !/\/login$/.test(req.url);
  }
}

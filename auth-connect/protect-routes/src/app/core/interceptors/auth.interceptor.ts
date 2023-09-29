import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from, mergeMap } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authentication: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(
      this.requestRequiresToken(request)
        ? this.authentication.getAccessToken().then((token) => {
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

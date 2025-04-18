import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthenticationExpediterService } from '../authentication/authentication-expediter/authentication-expediter.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const requestRequiresToken = (req: HttpRequest<any>): boolean => {
  return !/\/login$/.test(req.url);
};

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authentication = inject(AuthenticationExpediterService);

  return from(
    requestRequiresToken(request)
      ? authentication.getAccessToken().then((token) => {
          if (token) {
            request = request.clone({
              setHeaders: {
                Authorization: 'Bearer ' + token,
              },
            });
          }
        })
      : Promise.resolve(),
  ).pipe(mergeMap(() => next(request)));
};

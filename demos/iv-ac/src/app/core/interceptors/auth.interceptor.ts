import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, mergeMap } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';

const requestRequiresToken = (req: HttpRequest<any>): boolean => {
  return !/\/login$/.test(req.url);
};

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authentication = inject(AuthenticationService);

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

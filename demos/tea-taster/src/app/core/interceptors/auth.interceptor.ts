import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, mergeMap, tap } from 'rxjs';
import { SessionVaultService } from '../session-vault/session-vault.service';

const requestRequiresToken = (req: HttpRequest<any>): boolean => {
  return !/\/login$/.test(req.url);
};

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const sessionVault = inject(SessionVaultService);

  return from(sessionVault.get()).pipe(
    tap({
      next: (session) => {
        if (session && requestRequiresToken(request)) {
          request = request.clone({
            setHeaders: {
              Authorization: 'Bearer ' + session.token,
            },
          });
        }
      },
    }),
    mergeMap(() => next(request)),
  );
};

import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { unauthError } from '@app/store/actions';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

export const unauthInterceptor: HttpInterceptorFn = (request, next) => {
  const store = inject(Store);

  return next(request).pipe(
    tap({
      error: (err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          store.dispatch(unauthError());
        }
      },
    }),
  );
};

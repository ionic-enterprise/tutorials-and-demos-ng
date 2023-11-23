import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { tap } from 'rxjs/operators';

export const unauthInterceptor: HttpInterceptorFn = (request, next) => {
  const navController = inject(NavController);

  return next(request).pipe(
    tap({
      error: (err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          navController.navigateRoot(['/', 'login']);
        }
      },
    }),
  );
};

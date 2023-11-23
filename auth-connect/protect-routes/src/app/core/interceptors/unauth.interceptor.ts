import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { tap } from 'rxjs';
import { SessionService } from '../session.service';

export const unauthInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(SessionService);
  const navigation = inject(NavController);
  return next(request).pipe(
    tap({
      error: async (err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          await session.clear();
          navigation.navigateRoot(['/', 'tabs', 'tab1']);
        }
      },
    }),
  );
};

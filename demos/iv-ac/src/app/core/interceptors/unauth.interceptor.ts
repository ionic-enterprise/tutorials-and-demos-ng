import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { tap } from 'rxjs';
import { SessionVaultService } from '../session-vault/session-vault.service';

export const unauthInterceptor: HttpInterceptorFn = (request, next) => {
  const navController = inject(NavController);
  const sessionVault = inject(SessionVaultService);

  return next(request).pipe(
    tap({
      error: async (err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          await sessionVault.clear();
          navController.navigateRoot(['/', 'login']);
        }
      },
    }),
  );
};

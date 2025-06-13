import { Injectable, inject } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';

import { AuthenticationService, SessionVaultService, UnlockMode } from '@app/core';
import { User } from '@app/models';
import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutFailure,
  logoutSuccess,
  sessionLocked,
  unauthError,
  unlockSession,
  unlockSessionFailure,
  unlockSessionSuccess,
} from '@app/store/actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private auth = inject(AuthenticationService);
  private navController = inject(NavController);
  private sessionVault = inject(SessionVaultService);

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(login),
      exhaustMap((action) =>
        from(this.performLogin(action.mode as UnlockMode)).pipe(
          mergeMap(() => this.auth.getUserInfo() as Promise<User>),
          map((user) => loginSuccess({ user })),
          catchError(() => of(loginFailure({ errorMessage: 'Unknown error in login' }))),
        ),
      ),
    );
  });

  unlockSession$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(unlockSession),
      exhaustMap(() =>
        from(this.sessionVault.unlock()).pipe(
          mergeMap(() => this.auth.getUserInfo() as Promise<User>),
          map((user) => unlockSessionSuccess({ user })),
          catchError(() => of(unlockSessionFailure())),
        ),
      ),
    );
  });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(logout),
      exhaustMap(() =>
        from(this.auth.logout()).pipe(
          tap(() => this.sessionVault.clearSession()),
          map(() => logoutSuccess()),
          catchError(() => of(logoutFailure({ errorMessage: 'Unknown error in logout' }))),
        ),
      ),
    );
  });

  navigateToLogin$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logoutSuccess, sessionLocked),
        tap(() => this.navController.navigateRoot(['/', 'login'])),
      );
    },
    { dispatch: false },
  );

  navigateToRoot$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(loginSuccess, unlockSessionSuccess),
        tap(() => this.navController.navigateRoot(['/'])),
      );
    },
    { dispatch: false },
  );

  unauthError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(unauthError),
      tap(() => {
        this.sessionVault.clearSession();
      }),
      map(() => logoutSuccess()),
    );
  });

  private async performLogin(mode: UnlockMode): Promise<void> {
    await this.sessionVault.clearSession();
    await this.sessionVault.disableLocking();
    await this.auth.login();
    await this.sessionVault.enableLocking();
    if (mode) {
      await this.sessionVault.setUnlockMode(mode);
    }
  }
}

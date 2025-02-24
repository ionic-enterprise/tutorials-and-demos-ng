import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular/standalone';
import { AuthenticationService } from '../authentication/authentication.service';
import { SessionVaultService } from '../session-vault/session-vault.service';

export const authGuard: CanActivateFn = async (): Promise<boolean> => {
  const authentication = inject(AuthenticationService);
  const navController = inject(NavController);
  const sessionVault = inject(SessionVaultService);

  if (Capacitor.isNativePlatform() && (await sessionVault.sessionIsLocked())) {
    navController.navigateRoot(['/', 'login']);
    return false;
  }

  if (!(await authentication.isAuthenticated())) {
    navController.navigateRoot(['/', 'login']);
    return false;
  }

  return true;
};

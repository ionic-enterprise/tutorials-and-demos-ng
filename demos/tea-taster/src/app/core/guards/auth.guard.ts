import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { SessionVaultService } from '../session-vault/session-vault.service';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<boolean> => {
  const sessionVault = inject(SessionVaultService);
  const navController = inject(NavController);

  if (await sessionVault.get()) {
    return true;
  }

  navController.navigateRoot(['/', 'login']);
  return false;
};

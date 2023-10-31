import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthenticationService } from '../authentication/authentication.service';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Promise<boolean> => {
  const authService = inject(AuthenticationService);
  const navController = inject(NavController);

  if (await authService.isAuthenticated()) {
    return true;
  }

  navController.navigateRoot(['/', 'login']);
  return false;
};

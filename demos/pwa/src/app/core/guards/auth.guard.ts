import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { AuthenticationService } from '../authentication/authentication.service';

export const authGuard: CanActivateFn = async (): Promise<boolean> => {
  const authService = inject(AuthenticationService);
  const navController = inject(NavController);

  if (await authService.isAuthenticated()) {
    return true;
  }

  navController.navigateRoot(['/', 'login']);
  return false;
};

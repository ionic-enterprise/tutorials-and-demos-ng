import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { AuthenticationService } from '../authentication.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authentication = inject(AuthenticationService);
  const navigation = inject(NavController);

  if (await authentication.isAuthenticated()) {
    return true;
  }

  navigation.navigateRoot('/tabs/tab1');
  return false;
};

import { Injectable, inject } from '@angular/core';

import { NavController } from '@ionic/angular/standalone';
import { AuthenticationExpediterService } from '../authentication-expediter/authentication-expediter.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  private auth = inject(AuthenticationExpediterService);
  private navCtrl = inject(NavController);

  async canActivate(): Promise<boolean> {
    if (await this.auth.isAuthenticated()) {
      return true;
    } else {
      this.navCtrl.navigateRoot('/login');
      return false;
    }
  }
}

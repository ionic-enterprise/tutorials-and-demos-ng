import { Injectable } from '@angular/core';

import { NavController } from '@ionic/angular';
import { AuthenticationExpediterService } from '../authentication-expediter/authentication-expediter.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private auth: AuthenticationExpediterService,
    private navCtrl: NavController,
  ) {}

  async canActivate(): Promise<boolean> {
    if (await this.auth.isAuthenticated()) {
      return true;
    } else {
      this.navCtrl.navigateRoot('/login');
      return false;
    }
  }
}

import { Capacitor } from '@capacitor/core';

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { AuthenticationService } from '../core/authentication.service';

@Component({
  selector: 'app-auth-action-complete',
  templateUrl: './auth-action-complete.page.html',
  styleUrls: ['./auth-action-complete.page.scss'],
  imports: [FormsModule, IonContent],
})
export class AuthActionCompletePage {
  private auth = inject(AuthenticationService);
  private navController = inject(NavController);


  async ionViewDidEnter() {
    if (!Capacitor.isNativePlatform()) {
      await this.auth.handleAuthCallback();
      this.navController.navigateRoot('/');
    }
  }
}

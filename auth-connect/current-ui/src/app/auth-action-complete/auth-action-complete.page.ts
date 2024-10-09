import { Capacitor } from '@capacitor/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { AuthenticationService } from '../core/authentication.service';

@Component({
  selector: 'app-auth-action-complete',
  templateUrl: './auth-action-complete.page.html',
  styleUrls: ['./auth-action-complete.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent],
})
export class AuthActionCompletePage {
  constructor(
    private auth: AuthenticationService,
    private navController: NavController,
  ) {}

  async ionViewDidEnter() {
    if (!Capacitor.isNativePlatform()) {
      await this.auth.handleAuthCallback();
      this.navController.navigateRoot('/');
    }
  }
}

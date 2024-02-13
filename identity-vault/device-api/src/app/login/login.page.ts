import { Component } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { AuthenticationService } from '../core/authentication.service';
import { SessionVaultService } from '../core/session-vault.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar],
})
export class LoginPage {
  constructor(
    private navController: NavController,
    private authentication: AuthenticationService,
    private sessionVault: SessionVaultService,
  ) {}

  async login() {
    try {
      await this.authentication.login();
      await this.sessionVault.enhanceVault();
      this.navController.navigateRoot(['tabs', 'tab1']);
    } catch (err: unknown) {
      console.error('Failed to log in', err);
    }
  }
}

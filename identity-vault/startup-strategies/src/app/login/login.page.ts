import { Component, inject } from '@angular/core';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar],
})
export class LoginPage {
  private navController = inject(NavController);
  private authentication = inject(AuthenticationService);


  async login() {
    try {
      await this.authentication.login();
      this.navController.navigateRoot(['tabs', 'tab1']);
    } catch (err: unknown) {
      console.error('Failed to log in', err);
    }
  }
}

import { Component, inject } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonToast,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonToast,
  ],
})
export class LoginPage {
  private auth = inject(AuthenticationService);
  private nav = inject(NavController);

  loginFailed = false;

  constructor() {
    addIcons({ logInOutline });
  }

  async signIn() {
    try {
      await this.auth.login();
      this.nav.navigateRoot(['/']);
    } catch {
      this.loginFailed = true;
    }
  }
}

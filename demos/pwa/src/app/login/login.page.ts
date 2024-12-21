import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
    CommonModule,
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
  loginFailed = false;

  constructor(
    private auth: AuthenticationService,
    private nav: NavController,
  ) {
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

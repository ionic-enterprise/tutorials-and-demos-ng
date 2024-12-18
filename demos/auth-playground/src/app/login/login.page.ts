import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationExpediterService, SessionVaultService } from '@app/core';
import { AuthVendor } from '@app/models';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoAmazon, logoMicrosoft } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonInput,
    IonLabel,
    IonButton,
    IonIcon,
  ],
})
export class LoginPage {
  email = '';
  errorMessage = '';
  password = '';

  constructor(
    private auth: AuthenticationExpediterService,
    private navController: NavController,
    private vault: SessionVaultService,
  ) {
    addIcons({ logoAmazon, logoMicrosoft });
  }

  async basicSignIn(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.vault.initializeUnlockMode();
      await this.auth.login('Basic', { email: this.email, password: this.password });
      this.navController.navigateRoot(['/']);
    } catch (err) {
      console.error(err);
      this.errorMessage = 'Login failed. Please try again.';
    }
  }

  async oidcSignIn(vendor: AuthVendor): Promise<void> {
    this.errorMessage = '';
    try {
      await this.vault.initializeUnlockMode();
      await this.auth.login(vendor);
      this.navController.navigateRoot(['/']);
    } catch (err) {
      console.error(err);
      this.errorMessage = 'Login failed. Please try again.';
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationExpediterService, SessionVaultService } from '@app/core';
import { AuthVendor } from '@app/models';
import { NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoAmazon, logoMicrosoft } from 'ionicons/icons';
import {
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
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
  email: string = '';
  errorMessage: string = '';
  password: string = '';

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
      await this.auth.login('Basic', { email: this.email, password: this.password });
      await this.vault.initializeUnlockMode();
      this.navController.navigateRoot(['/']);
    } catch (err) {
      this.errorMessage = 'Login failed. Please try again.';
    }
  }

  async oidcSignIn(vendor: AuthVendor): Promise<void> {
    this.errorMessage = '';
    try {
      await this.auth.login(vendor);
      await this.vault.initializeUnlockMode();
      this.navController.navigateRoot(['/']);
    } catch (err) {
      this.errorMessage = 'Login failed. Please try again.';
    }
  }
}

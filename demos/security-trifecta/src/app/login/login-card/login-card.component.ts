import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline } from 'ionicons/icons';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonLoading,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonCheckbox,
    IonLoading,
  ],
})
export class LoginCardComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  authenticating: boolean = false;
  showSessionLocking: boolean;
  useSessionLocking: boolean = false;
  errorMessage: string = '';

  constructor(
    platform: Platform,
    private authentication: AuthenticationService,
    private sessionVault: SessionVaultService,
  ) {
    this.showSessionLocking = platform.is('hybrid');
    addIcons({ logInOutline });
  }

  async signIn() {
    try {
      this.authenticating = true;
      await this.sessionVault.disableLocking();
      await this.authentication.login();
      this.loginSuccess.emit();
    } catch (err) {
      this.errorMessage = 'Invalid email or password';
    } finally {
      this.authenticating = false;
      await this.sessionVault.enableLocking();
    }
  }

  async useSessionLockingChanged() {
    if (this.useSessionLocking) {
      await this.sessionVault.initializeUnlockMode();
    } else {
      await this.sessionVault.resetUnlockMode();
    }
  }
}

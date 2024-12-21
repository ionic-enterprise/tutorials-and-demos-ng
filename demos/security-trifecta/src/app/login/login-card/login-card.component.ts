import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService, SessionVaultService } from '@app/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCheckbox,
  IonIcon,
  IonLoading,
  Platform,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logInOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss'],
  imports: [
    FormsModule,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCheckbox,
    IonIcon,
    IonLoading,
  ],
})
export class LoginCardComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  authenticating = false;
  showSessionLocking: boolean;
  useSessionLocking = false;
  errorMessage = '';

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
    } catch {
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

import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { Capacitor } from '@capacitor/core';
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
  private authentication = inject(AuthenticationService);
  private sessionVault = inject(SessionVaultService);

  @Output() loginSuccess = new EventEmitter<void>();

  authenticating = false;
  showSessionLocking: boolean;
  useSessionLocking = false;
  errorMessage = '';

  constructor() {
    this.showSessionLocking = Capacitor.isNativePlatform();
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

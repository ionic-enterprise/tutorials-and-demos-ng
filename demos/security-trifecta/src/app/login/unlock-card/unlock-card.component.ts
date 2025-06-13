import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionVaultService } from '@app/core';
import { addIcons } from 'ionicons';
import { lockOpenOutline, logInOutline } from 'ionicons/icons';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-unlock-card',
  templateUrl: './unlock-card.component.html',
  styleUrls: ['./unlock-card.component.scss'],
  imports: [FormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonIcon],
})
export class UnlockCardComponent {
  private sessionVault = inject(SessionVaultService);

  @Output() unlock = new EventEmitter<void>();
  @Output() vaultClear = new EventEmitter<void>();

  errorMessage = '';

  constructor() {
    addIcons({ lockOpenOutline, logInOutline });
  }

  async redoClicked() {
    await this.sessionVault.clearSession();
    this.vaultClear.emit();
  }

  async unlockClicked() {
    try {
      await this.sessionVault.getSession();
      this.unlock.emit();
    } catch {
      this.errorMessage = 'Unlock failed';
    }
  }
}

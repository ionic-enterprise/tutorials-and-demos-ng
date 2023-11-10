import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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
  ],
})
export class UnlockCardComponent {
  @Output() unlock = new EventEmitter<void>();
  @Output() vaultClear = new EventEmitter<void>();

  errorMessage: string;

  constructor(private sessionVault: SessionVaultService) {
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
    } catch (err) {
      this.errorMessage = 'Unlock failed';
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationExpediterService, SessionVaultService } from '@app/core';
import { NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockOpenOutline, arrowRedoOutline } from 'ionicons/icons';
import { IonContent, IonCard, IonCardContent, IonCardTitle, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-unlock',
  templateUrl: './unlock.page.html',
  styleUrls: ['./unlock.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonCard, IonCardContent, IonCardTitle, IonButton, IonIcon],
})
export class UnlockPage {
  constructor(
    private auth: AuthenticationExpediterService,
    private navController: NavController,
    private sessionVault: SessionVaultService,
  ) {
    addIcons({ lockOpenOutline, arrowRedoOutline });
  }

  async unlock(): Promise<void> {
    if (await this.sessionVault.canUnlock()) {
      await this.tryUnlock();
    } else {
      this.navController.navigateRoot(['/', 'login']);
    }
  }

  async redo(): Promise<void> {
    await this.sessionVault.clear();
    await this.auth.logout();
    this.navController.navigateRoot(['/', 'login']);
  }

  private async tryUnlock(): Promise<void> {
    try {
      await this.sessionVault.unlock();
      this.navController.navigateRoot(['/']);
    } catch (error) {
      // you could alert or otherwise set an error message
      // the most common failure is the user cancelling, so we just don't navigate
    }
  }
}

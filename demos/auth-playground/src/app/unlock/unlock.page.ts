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
  imports: [FormsModule, IonContent, IonCard, IonCardContent, IonCardTitle, IonButton, IonIcon],
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
      console.error(error);
      // you could alert or otherwise set an error message
      // the most common failure is the user canceling, so we just don't navigate
    }
  }
}

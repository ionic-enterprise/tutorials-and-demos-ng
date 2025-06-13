import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService, SessionVaultService } from '@app/core';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonIcon,
  NavController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowRedoOutline, lockOpenOutline } from 'ionicons/icons';

@Component({
  selector: 'app-unlock',
  templateUrl: './unlock.page.html',
  styleUrls: ['./unlock.page.scss'],
  imports: [ReactiveFormsModule, IonContent, IonCard, IonCardContent, IonCardTitle, IonButton, IonIcon],
})
export class UnlockPage {
  private navController = inject(NavController);
  private auth = inject(AuthenticationService);
  private session = inject(SessionVaultService);

  constructor() {
    addIcons({ lockOpenOutline, arrowRedoOutline });
  }

  async unlockClicked() {
    try {
      await this.session.getSession();
      this.navController.navigateRoot('/tabs/tea');
    } catch (err) {
      console.error(err);
    }
  }

  async redoClicked() {
    await this.session.clear();
    await this.auth.logout();
    this.navController.navigateRoot('/login');
  }
}

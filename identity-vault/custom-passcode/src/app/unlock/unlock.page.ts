import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { AuthenticationService } from '../core/authentication.service';
import { SessionVaultService } from '../core/session-vault.service';

@Component({
  selector: 'app-unlock',
  templateUrl: './unlock.page.html',
  styleUrls: ['./unlock.page.scss'],
  imports: [IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar, FormsModule],
})
export class UnlockPage {
  private authentication = inject(AuthenticationService);
  private navController = inject(NavController);
  private sessionVault = inject(SessionVaultService);


  async redoLogin(): Promise<void> {
    await this.authentication.logout();
    this.navController.navigateRoot(['login']);
  }

  async unlock(): Promise<void> {
    try {
      await this.sessionVault.unlock();
      this.navController.navigateRoot(['tabs', 'tab1']);
    } catch (err: unknown) {
      console.error(err);
    }
  }
}

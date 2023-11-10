import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { NavController, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockOpenOutline, arrowRedoOutline } from 'ionicons/icons';
import { IonContent, IonCard, IonCardContent, IonCardTitle, IonButton, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-unlock',
  templateUrl: './unlock.page.html',
  styleUrls: ['./unlock.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonContent, IonCard, IonCardContent, IonCardTitle, IonButton, IonIcon],
})
export class UnlockPage {
  constructor(
    private navController: NavController,
    private auth: AuthenticationService,
    private session: SessionVaultService,
  ) {
    addIcons({ lockOpenOutline, arrowRedoOutline });
  }

  async unlockClicked() {
    try {
      await this.session.getSession();
      this.navController.navigateRoot('/tabs/tea');
    } catch (err) {}
  }

  async redoClicked() {
    await this.session.clear();
    await this.auth.logout();
    this.navController.navigateRoot('/login');
  }
}

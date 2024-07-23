import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonButton, IonContent, IonItem, IonLabel, IonList, NavController } from '@ionic/angular/standalone';
import { AuthenticationService } from '../core/authentication.service';
import { SessionVaultService } from '../core/session-vault.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonContent, IonItem, IonLabel, IonList],
})
export class StartPage {
  showUnlock: boolean = false;

  constructor(
    private authentication: AuthenticationService,
    private navController: NavController,
    private sessionVault: SessionVaultService,
  ) {}

  ionViewDidEnter() {
    setTimeout(() => {
      this.performUnlockFlow();
    }, 100);
  }

  async performUnlockFlow() {
    await this.attemptUnlock();
    await this.attemptNavigation();
  }

  async redoLogin() {
    await this.authentication.logout();
    this.navController.navigateRoot(['login']);
  }

  private async attemptNavigation(): Promise<void> {
    if (!(await this.sessionVault.isLocked())) {
      if (await this.authentication.isAuthenticated()) {
        this.navController.navigateRoot(['tabs', 'tab1']);
      } else {
        this.navController.navigateRoot(['login']);
      }
    }
  }

  private async attemptUnlock(): Promise<void> {
    if (await this.sessionVault.isLocked()) {
      try {
        await this.sessionVault.unlock();
      } catch (err: unknown) {
        this.showUnlock = true;
      }
    }
  }
}

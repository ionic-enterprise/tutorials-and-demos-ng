import { Component, OnInit } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { AuthenticationService } from '../core/authentication.service';
import { SessionVaultService } from '../core/session-vault.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  imports: [IonContent],
})
export class StartPage implements OnInit {
  showUnlock = false;

  constructor(
    private authentication: AuthenticationService,
    private navController: NavController,
    private sessionVault: SessionVaultService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.performUnlock();
    await this.performNavigation();
  }

  private async performNavigation(): Promise<void> {
    if (!(await this.sessionVault.isLocked())) {
      if (await this.authentication.isAuthenticated()) {
        this.navController.navigateRoot(['tabs', 'tab1']);
      } else {
        this.navController.navigateRoot(['login']);
      }
    }
  }

  private async performUnlock(): Promise<void> {
    if (await this.sessionVault.isLocked()) {
      try {
        await this.sessionVault.unlock();
      } catch (err: unknown) {
        console.error(err);
        this.navController.navigateRoot(['unlock']);
      }
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular/standalone';
import { AuthenticationService } from '../core/authentication.service';
import { SessionVaultService } from '../core/session-vault.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: true,
  imports: [IonContent],
})
export class StartPage implements OnInit {
  showUnlock: boolean = false;

  constructor(
    private authentication: AuthenticationService,
    private navController: NavController,
    private sessionVault: SessionVaultService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.attemptUnlock();
    await this.attemptNavigation();
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
        this.navController.navigateRoot(['unlock']);
      }
    }
  }
}

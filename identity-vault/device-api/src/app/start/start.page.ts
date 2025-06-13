import { Component, OnInit, inject } from '@angular/core';
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
  private authentication = inject(AuthenticationService);
  private navController = inject(NavController);
  private sessionVault = inject(SessionVaultService);

  showUnlock = false;

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
      } catch {
        this.navController.navigateRoot(['unlock']);
      }
    }
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { SessionVaultService, SyncService } from '@app/core';
import { IonContent, IonLoading, NavController } from '@ionic/angular/standalone';
import { LoginCardComponent } from './login-card/login-card.component';
import { UnlockCardComponent } from './unlock-card/unlock-card.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [LoginCardComponent, UnlockCardComponent, IonContent, IonLoading],
})
export class LoginPage implements OnInit {
  private navController = inject(NavController);
  private sessionVault = inject(SessionVaultService);
  private sync = inject(SyncService);

  showUnlock = false;
  syncing = false;

  async ngOnInit() {
    this.showUnlock = await this.sessionVault.sessionIsLocked();
  }

  async onLoginSuccess(): Promise<void> {
    this.syncing = true;
    await this.sync.execute();
    this.navController.navigateRoot(['/', 'tasting-notes']);
    this.syncing = false;
  }

  onUnlock(): void {
    this.navController.navigateRoot(['/', 'tasting-notes']);
  }

  onVaultClear(): void {
    this.showUnlock = false;
  }
}

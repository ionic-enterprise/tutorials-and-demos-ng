import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { Capacitor } from '@capacitor/core';
import { VaultErrorCodes } from '@ionic-enterprise/identity-vault';
import { IonContent, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  imports: [ReactiveFormsModule, IonContent],
})
export class StartPage implements OnInit {
  private navController = inject(NavController);
  private auth = inject(AuthenticationService);
  private session = inject(SessionVaultService);

  async ngOnInit() {
    if (Capacitor.isNativePlatform() && (await this.session.canUnlock())) {
      this.tryUnlock();
    } else {
      this.navController.navigateRoot('/tabs/tea');
    }
  }

  private async tryUnlock() {
    try {
      await this.session.unlockVault();
      this.navController.navigateRoot('/tabs/tea');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.code === VaultErrorCodes.InvalidatedCredential) {
        await this.session.setUnlockMode('SecureStorage');
        await this.auth.logout();
        this.navController.navigateRoot('/login');
      } else {
        this.navController.navigateRoot('/unlock');
      }
    }
  }
}

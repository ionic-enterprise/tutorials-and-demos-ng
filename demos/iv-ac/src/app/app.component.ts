import { Component, OnInit, inject } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { VaultErrorCodes } from '@ionic-enterprise/identity-vault';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { AuthenticationService, SessionVaultService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private auth = inject(AuthenticationService);
  private sessionVault = inject(SessionVaultService);

  constructor() {
    const navController = inject(NavController);
    const sessionVault = this.sessionVault;

    sessionVault.locked.subscribe(async (locked) => {
      if (locked) {
        try {
          await sessionVault.unlockVault();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          if (err.code === VaultErrorCodes.InvalidatedCredential) {
            await this.sessionVault.setUnlockMode('SecureStorage');
            await this.auth.logout();
            navController.navigateRoot('/login');
          } else {
            navController.navigateRoot('/unlock');
          }
        }
      }
    });

    this.init();
  }

  async init() {
    const hide = await this.sessionVault.isHidingContentsInBackground();
    this.sessionVault.hideContentsInBackground(hide);
  }

  ngOnInit() {
    SplashScreen.hide();
  }
}

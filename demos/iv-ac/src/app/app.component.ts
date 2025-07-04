import { Component, OnInit, inject } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { NavController } from '@ionic/angular/standalone';
import { SessionVaultService } from './core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private sessionVault = inject(SessionVaultService);

  constructor() {
    const navController = inject(NavController);
    const sessionVault = this.sessionVault;

    sessionVault.locked.subscribe(async (locked) => {
      if (locked) {
        try {
          await sessionVault.unlockVault();
        } catch {
          navController.navigateRoot('/unlock');
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

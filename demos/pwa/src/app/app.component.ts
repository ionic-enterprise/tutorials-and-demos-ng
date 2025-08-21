import { Component, OnInit, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { ApplicationService, SessionVaultService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private application = inject(ApplicationService);
  private sessionVault = inject(SessionVaultService);

  constructor() {
    const sessionVault = this.sessionVault;
    const navController = inject(NavController);

    sessionVault.locked.subscribe(async (locked) => {
      if (locked) {
        try {
          await sessionVault.unlockVault();
        } catch {
          navController.navigateRoot('/unlock');
        }
      }
    });
  }

  async ngOnInit() {
    if (!Capacitor.isNativePlatform()) {
      this.application.registerForUpdates();
    }
    const hide = await this.sessionVault.isHidingContentsInBackground();
    this.sessionVault.hideContentsInBackground(hide);
  }
}

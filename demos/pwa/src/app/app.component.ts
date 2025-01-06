import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { NavController, Platform } from '@ionic/angular/standalone';
import { ApplicationService, SessionVaultService } from './core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private application: ApplicationService,
    private platform: Platform,
    private sessionVault: SessionVaultService,
    navController: NavController,
  ) {
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
    if (!this.platform.is('hybrid')) {
      this.application.registerForUpdates();
    }
  }
}

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
  standalone: true,
  imports: [CommonModule, IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private application: ApplicationService,
    private platform: Platform,
    private sessionVault: SessionVaultService,
    navController: NavController,
  ) {
    sessionVault.locked.subscribe((locked) => {
      if (locked) navController.navigateRoot('/start');
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

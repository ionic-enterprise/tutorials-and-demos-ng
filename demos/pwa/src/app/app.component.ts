import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonicModule, NavController, Platform } from '@ionic/angular';
import { ApplicationService, SessionVaultService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
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

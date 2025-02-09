import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { PreferencesService, SessionVaultService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private navController: NavController,
    private preferences: PreferencesService,
    private sessionVault: SessionVaultService,
  ) {}

  async ngOnInit() {
    this.handlePreferencesChange();
    this.handleLocked();
    PrivacyScreen.enable();
    SplashScreen.hide();
  }

  private handlePreferencesChange() {
    this.preferences.preferencesChanged$.subscribe(() => {
      document.documentElement.classList.toggle('ion-palette-dark', !!this.preferences.prefersDarkMode);
    });
  }

  private async handleLocked() {
    this.sessionVault.locked$.subscribe((locked) => {
      if (locked) {
        this.navController.navigateRoot(['/', 'login']);
      }
    });
  }
}

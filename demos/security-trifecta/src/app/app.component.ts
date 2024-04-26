import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { PreferencesService, SessionVaultService } from './core';
import { Device } from '@ionic-enterprise/identity-vault';
import { SplashScreen } from '@capacitor/splash-screen';
import { CommonModule } from '@angular/common';
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
    private navController: NavController,
    private preferences: PreferencesService,
    private sessionVault: SessionVaultService,
  ) {}

  async ngOnInit() {
    this.handlePreferencesChange();
    this.handleLocked();
    Device.setHideScreenOnBackground(true);
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

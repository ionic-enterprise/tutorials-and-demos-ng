import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Device } from '@ionic-enterprise/identity-vault';
import { NavController } from '@ionic/angular/standalone';
import { SessionVaultService } from './core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private navController: NavController,
    private vault: SessionVaultService,
  ) {}

  ngOnInit(): void {
    this.vault.locked.subscribe((lock: boolean) => {
      if (lock) {
        this.navController.navigateRoot(['/', 'unlock']);
      }
    });

    SplashScreen.hide();

    Device.setHideScreenOnBackground(true);
  }
}

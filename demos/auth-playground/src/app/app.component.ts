import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { Device } from '@ionic-enterprise/identity-vault';
import { IonicModule, NavController } from '@ionic/angular';
import { SessionVaultService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
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

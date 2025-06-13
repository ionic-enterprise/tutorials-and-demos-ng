import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionVaultService } from '@app/core';
import { Capacitor } from '@capacitor/core';
import { IonContent, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  imports: [ReactiveFormsModule, IonContent],
})
export class StartPage implements OnInit {
  private navController = inject(NavController);
  private session = inject(SessionVaultService);


  async ngOnInit() {
    if (Capacitor.isNativePlatform() && (await this.session.canUnlock())) {
      this.tryUnlock();
    } else {
      this.navController.navigateRoot('/tabs/tea');
    }
  }

  private async tryUnlock() {
    try {
      await this.session.unlockVault();
      this.navController.navigateRoot('/tabs/tea');
    } catch {
      this.navController.navigateRoot('/unlock');
    }
  }
}

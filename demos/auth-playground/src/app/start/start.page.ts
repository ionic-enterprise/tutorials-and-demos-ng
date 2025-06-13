import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionVaultService } from '@app/core';
import { Capacitor } from '@capacitor/core';
import { IonContent, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  imports: [FormsModule, IonContent],
})
export class StartPage implements OnInit {
  private navContoller = inject(NavController);
  private sessionVault = inject(SessionVaultService);

  async ngOnInit() {
    if (Capacitor.isNativePlatform() && (await this.sessionVault.canUnlock())) {
      this.navContoller.navigateRoot(['/', 'unlock']);
    } else {
      this.navContoller.navigateRoot(['/', 'tabs', 'tea-list']);
    }
  }
}

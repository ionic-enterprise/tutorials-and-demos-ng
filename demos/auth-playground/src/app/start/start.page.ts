import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionVaultService } from '@app/core';
import { Capacitor } from '@capacitor/core';
import { IonContent, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  imports: [CommonModule, FormsModule, IonContent],
})
export class StartPage implements OnInit {
  constructor(
    private navContoller: NavController,
    private sessionVault: SessionVaultService,
  ) {}

  async ngOnInit() {
    if (Capacitor.isNativePlatform() && (await this.sessionVault.canUnlock())) {
      this.navContoller.navigateRoot(['/', 'unlock']);
    } else {
      this.navContoller.navigateRoot(['/', 'tabs', 'tea-list']);
    }
  }
}

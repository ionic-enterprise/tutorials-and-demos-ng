import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionVaultService } from '@app/core';
import { IonicModule, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class StartPage implements OnInit {
  constructor(
    private navContoller: NavController,
    private platform: Platform,
    private sessionVault: SessionVaultService,
  ) {}

  async ngOnInit() {
    if (this.platform.is('hybrid') && (await this.sessionVault.canUnlock())) {
      this.navContoller.navigateRoot(['/', 'unlock']);
    } else {
      this.navContoller.navigateRoot(['/', 'tabs', 'tea-list']);
    }
  }
}

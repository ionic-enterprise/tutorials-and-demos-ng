import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionVaultService } from '@app/core';
import { IonicModule, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class StartPage implements OnInit {
  constructor(
    private navController: NavController,
    private platform: Platform,
    private session: SessionVaultService,
  ) {}

  async ngOnInit() {
    if (this.platform.is('hybrid') && (await this.session.canUnlock())) {
      this.navController.navigateRoot('/unlock');
    } else {
      this.navController.navigateRoot('/tabs/tea');
    }
  }
}

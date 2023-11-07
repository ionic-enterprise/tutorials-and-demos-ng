import { Component } from '@angular/core';
import { PreferencesPage } from '@app/preferences/preferences.page';
import { IonicModule, ModalController } from '@ionic/angular';
import packageInfo from '../../../package.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class AboutPage {
  author: string;
  name: string;
  description: string;
  version: string;

  constructor(private modalController: ModalController) {
    this.author = packageInfo.author;
    this.name = packageInfo.name;
    this.description = packageInfo.description;
    this.version = packageInfo.version;
  }

  async openPreferences() {
    const dlg = await this.modalController.create({
      backdropDismiss: false,
      component: PreferencesPage,
    });
    dlg.present();
  }
}

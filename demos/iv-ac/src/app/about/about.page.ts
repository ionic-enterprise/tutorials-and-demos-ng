import { Component } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { PreferencesPage } from '@app/preferences/preferences.page';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
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

  constructor(
    private auth: AuthenticationService,
    private modalController: ModalController,
    private nav: NavController,
  ) {
    this.author = packageInfo.author;
    this.name = packageInfo.name;
    this.description = packageInfo.description;
    this.version = packageInfo.version;
  }

  async logout() {
    await this.auth.logout();
    this.nav.navigateRoot(['/', 'login']);
  }

  async openPreferences() {
    const dlg = await this.modalController.create({
      backdropDismiss: false,
      component: PreferencesPage,
    });
    dlg.present();
    const { data } = await dlg.onDidDismiss();
  }
}

import { Component } from '@angular/core';
import { PreferencesPage } from '@app/preferences/preferences.page';
import { ModalController } from '@ionic/angular/standalone';
import packageInfo from '../../../package.json';
import { addIcons } from 'ionicons';
import { settingsOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonNote,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonNote,
  ],
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
    addIcons({ settingsOutline });
  }

  async openPreferences() {
    const dlg = await this.modalController.create({
      backdropDismiss: false,
      component: PreferencesPage,
    });
    dlg.present();
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { logout } from '@app/store/actions';
import { Store } from '@ngrx/store';
import packageInfo from '../../../package.json';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';
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
    FormsModule,
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
export class AboutPage implements OnInit {
  private store = inject(Store);

  author = '';
  name = '';
  description = '';
  version = '';

  constructor() {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    this.author = packageInfo.author;
    this.name = packageInfo.name;
    this.description = packageInfo.description;
    this.version = packageInfo.version;
  }

  logout() {
    this.store.dispatch(logout());
  }
}

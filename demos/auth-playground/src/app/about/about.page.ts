import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthenticationExpediterService, SessionVaultService } from '@app/core';
import { NavController } from '@ionic/angular/standalone';
import packageInfo from '../../../package.json';
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
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
  author: string = '';
  name: string = '';
  version: string = '';
  authConnectVersion: string = '';
  identityVaultVersion: string = '';

  constructor(
    private auth: AuthenticationExpediterService,
    private navController: NavController,
    private vault: SessionVaultService,
  ) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    this.author = packageInfo.author;
    this.name = packageInfo.name;
    this.version = packageInfo.version;
    this.authConnectVersion = packageInfo.dependencies['@ionic-enterprise/auth'];
    this.identityVaultVersion = packageInfo.dependencies['@ionic-enterprise/identity-vault'];
  }

  async logout(): Promise<void> {
    await this.vault.setUnlockMode('NeverLock');
    await this.auth.logout();
    this.navController.navigateRoot(['/', 'login']);
  }
}

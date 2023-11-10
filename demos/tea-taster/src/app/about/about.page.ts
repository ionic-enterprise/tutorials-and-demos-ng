import { Component } from '@angular/core';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { NavController } from '@ionic/angular/standalone';
import { tap } from 'rxjs';
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
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
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

  constructor(
    private auth: AuthenticationService,
    private nav: NavController,
    private sessionVault: SessionVaultService,
  ) {
    this.author = packageInfo.author;
    this.name = packageInfo.name;
    this.description = packageInfo.description;
    this.version = packageInfo.version;
    addIcons({ logOutOutline });
  }

  logout() {
    this.auth
      .logout()
      .pipe(
        tap(async () => {
          await this.sessionVault.clear();
          this.nav.navigateRoot(['/', 'login']);
        }),
      )
      .subscribe();
  }
}

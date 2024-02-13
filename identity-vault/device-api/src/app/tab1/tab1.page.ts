import { Component, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { SessionVaultService, UnlockMode } from '../core/session-vault.service';
import { Session } from '../models/session';
import { AuthenticationService } from '../core/authentication.service';
import { BiometricPermissionState, Device } from '@ionic-enterprise/identity-vault';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar, IonTitle],
})
export class Tab1Page implements OnInit {
  session: Session | null = null;
  disableBiometrics: boolean = false;

  constructor(
    private authentication: AuthenticationService,
    private navController: NavController,
    private sessionVault: SessionVaultService,
  ) {}

  async ngOnInit() {
    this.session = await this.sessionVault.getSession();
    this.disableBiometrics =
      !(await Device.isBiometricsEnabled()) ||
      (await Device.isBiometricsAllowed()) !== BiometricPermissionState.Granted;
  }

  async logout(): Promise<void> {
    await this.authentication.logout();
    this.navController.navigateRoot('/');
  }

  async changeUnlockMode(mode: UnlockMode) {
    await this.sessionVault.updateUnlockMode(mode);
  }

  async lock(): Promise<void> {
    this.session = null;
    await this.sessionVault.lock();
  }
}

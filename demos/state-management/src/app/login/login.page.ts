import { CommonModule } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionVaultService, UnlockMode } from '@app/core';
import { State, selectAuthErrorMessage } from '@app/store';
import { login, unlockSession } from '@app/store/actions';
import { Device } from '@ionic-enterprise/identity-vault';
import {
  AlertController,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRadio,
  IonRadioGroup,
  Platform,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { arrowRedoOutline, lockOpenOutline, logInOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonList,
    IonRadioGroup,
    IonListHeader,
    IonLabel,
    IonItem,
    IonRadio,
    IonIcon,
  ],
  standalone: true,
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  canUnlock: boolean = false;

  displayLockingOptions: boolean = false;
  unlockMode: UnlockMode | undefined;
  unlockModes: Array<{ mode: UnlockMode; label: string }> = [
    {
      mode: 'SessionPIN',
      label: 'Session PIN Unlock',
    },
    {
      mode: 'NeverLock',
      label: 'Never Lock Session',
    },
    {
      mode: 'ForceLogin',
      label: 'Force Login',
    },
  ];

  errorMessage$: Observable<string> | undefined;

  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private sessionVault: SessionVaultService,
    private store: Store<State>,
    private zone: NgZone,
  ) {
    addIcons({ logInOutline, lockOpenOutline, arrowRedoOutline });
  }

  async ngOnInit(): Promise<void> {
    this.errorMessage$ = this.store.select(selectAuthErrorMessage);
    if (this.platform.is('hybrid')) {
      this.canUnlock = await this.sessionVault.canUnlock();
      this.displayLockingOptions = true;
      if (await Device.isBiometricsEnabled()) {
        this.unlockModes = [
          {
            mode: 'Device',
            label: 'Biometric Unlock',
          },
          ...this.unlockModes,
        ];
      }
      this.unlockMode = this.unlockModes[0].mode;
    } else {
      this.displayLockingOptions = false;
      this.canUnlock = false;
    }
  }

  signIn() {
    this.store.dispatch(login({ mode: this.unlockMode }));
  }

  redo() {
    this.zone.run(() => {
      this.canUnlock = false;
    });
  }

  async unlock() {
    this.canUnlock = await this.sessionVault.canUnlock();
    if (this.canUnlock) {
      this.store.dispatch(unlockSession());
    } else {
      const alert = await this.alertController.create({
        header: 'Session Terminated',
        message: 'Your session has been terminated. You must log in again.',
        buttons: ['OK'],
      });
      alert.present();
    }
  }
}

import { AsyncPipe } from '@angular/common';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionVaultService, UnlockMode } from '@app/core';
import { selectAuthErrorMessage } from '@app/store';
import { login, unlockSession } from '@app/store/actions';
import { Capacitor } from '@capacitor/core';
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
    AsyncPipe,
    FormsModule,
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonRadio,
    IonRadioGroup,
  ],
})
export class LoginPage implements OnInit {
  private alertController = inject(AlertController);
  private sessionVault = inject(SessionVaultService);
  private store = inject(Store);
  private zone = inject(NgZone);

  email = '';
  password = '';
  canUnlock = false;

  displayLockingOptions = false;
  unlockMode: UnlockMode | undefined;
  unlockModes: { mode: UnlockMode; label: string }[] = [
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

  constructor() {
    addIcons({ logInOutline, lockOpenOutline, arrowRedoOutline });
  }

  async ngOnInit(): Promise<void> {
    this.errorMessage$ = this.store.select(selectAuthErrorMessage);
    if (Capacitor.isNativePlatform()) {
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

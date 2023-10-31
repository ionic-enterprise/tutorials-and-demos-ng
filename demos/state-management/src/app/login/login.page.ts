import { Component, NgZone, OnInit } from '@angular/core';
import { SessionVaultService, UnlockMode } from '@app/core';
import { selectAuthErrorMessage } from '@app/store';
import { login, unlockSession } from '@app/store/actions';
import { Device } from '@ionic-enterprise/identity-vault';
import { AlertController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  canUnlock = false;

  displayLockingOptions: boolean;
  unlockMode: UnlockMode;
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

  errorMessage$: Observable<string>;

  constructor(
    private alertController: AlertController,
    private platform: Platform,
    private sessionVault: SessionVaultService,
    private store: Store,
    private zone: NgZone,
  ) {}

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

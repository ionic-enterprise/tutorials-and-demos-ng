import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { SessionVaultService } from './core';
import { startup } from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private session: SessionVaultService,
    private store: Store,
  ) {}

  async ngOnInit() {
    PrivacyScreen.enable();
    SplashScreen.hide();
    if (!this.platform.is('hybrid') || (!(await this.session.isEmpty()) && !(await this.session.isLocked()))) {
      this.store.dispatch(startup());
    }
  }
}

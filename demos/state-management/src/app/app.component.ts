import { Component, OnInit, inject } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { SessionVaultService } from './core';
import { startup } from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private session = inject(SessionVaultService);
  private store = inject(Store);

  async ngOnInit() {
    PrivacyScreen.enable();
    if (!Capacitor.isNativePlatform() || (!(await this.session.isEmpty()) && !(await this.session.isLocked()))) {
      this.store.dispatch(startup());
    }
  }
}

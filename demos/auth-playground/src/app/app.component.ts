import { Component, OnInit, inject } from '@angular/core';
import { PrivacyScreen } from '@capacitor/privacy-screen';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { SessionVaultService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private navController = inject(NavController);
  private vault = inject(SessionVaultService);

  ngOnInit(): void {
    this.vault.locked.subscribe((lock: boolean) => {
      if (lock) {
        this.navController.navigateRoot(['/', 'unlock']);
      }
    });

    PrivacyScreen.enable();
  }
}

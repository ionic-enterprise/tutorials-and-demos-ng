import { Component, OnDestroy } from '@angular/core';
import { IonApp, IonRouterOutlet, NavController } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { SessionVaultService } from './core/session-vault.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnDestroy {
  private subscription: Subscription;

  constructor(navController: NavController, sessionVault: SessionVaultService) {
    this.subscription = sessionVault.locked$.subscribe((lock) => {
      if (lock) {
        navController.navigateRoot(['/']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionVaultService } from '@app/core';
import { Capacitor } from '@capacitor/core';
import { IonContent, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  imports: [FormsModule, IonContent],
})
export class StartPage implements OnInit {
  private navController = inject(NavController);
  private session = inject(SessionVaultService);


  async ngOnInit() {
    if (Capacitor.isNativePlatform() && (await this.session.isLocked())) {
      this.navController.navigateRoot('/login');
    } else {
      this.navController.navigateRoot('/tabs/tea');
    }
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SessionVaultService } from '@app/core';
import { AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-value-list',
  templateUrl: './value-list.page.html',
  styleUrls: ['./value-list.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class ValueListPage implements OnInit {
  private alertController = inject(AlertController);
  private sessionVault = inject(SessionVaultService);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: { key: string; value?: any }[] = [];

  constructor() {
    addIcons({ add });
  }

  ngOnInit() {
    this.getValues();
  }

  async addValue() {
    const alert = await this.alertController.create({
      header: 'Key/Value Pair',
      subHeader: 'Enter a new key for new data or an existing key to supply different data for that key',
      inputs: [
        {
          name: 'key',
          type: 'text',
          placeholder: 'Key',
        },
        {
          name: 'value',
          id: 'value',
          type: 'textarea',
          placeholder: 'Value',
        },
      ],
      backdropDismiss: false,
      buttons: ['OK', 'Cancel'],
    });
    await alert.present();
    const { data, role } = await alert.onDidDismiss();
    if (data.values && data.values.key && data.values.value && role !== 'cancel') {
      await this.sessionVault.setValue(data.values.key, data.values.value);
    }
    this.getValues();
  }

  private async getValues() {
    const keys = await this.sessionVault.getKeys();
    this.values = await Promise.all(
      keys.map(async (key: string) => ({
        key,
        value: JSON.stringify(await this.sessionVault.getValue(key), undefined, 2),
      })),
    );
  }
}

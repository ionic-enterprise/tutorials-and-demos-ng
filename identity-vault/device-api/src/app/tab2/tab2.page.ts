import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Device } from '@ionic-enterprise/identity-vault';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  hasSecureHardware: Boolean = false;
  isBiometricsSupported: Boolean = false;
  availableHardware: Array<string> = [];

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.hasSecureHardware = await Device.hasSecureHardware();
    this.isBiometricsSupported = await Device.isBiometricsSupported();
    this.availableHardware = await Device.getAvailableHardware();
  }
}

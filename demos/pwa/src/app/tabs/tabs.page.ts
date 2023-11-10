import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { leaf, documentText, informationCircle } from 'ionicons/icons';
import { IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon],
})
export class TabsPage {
  constructor() {
    addIcons({ leaf, documentText, informationCircle });
  }
}

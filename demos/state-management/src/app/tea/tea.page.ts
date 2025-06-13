import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tea } from '@app/models';
import { selectTeasMatrix } from '@app/store';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonRow,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tea',
  templateUrl: './tea.page.html',
  styleUrls: ['./tea.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonImg,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
})
export class TeaPage implements OnInit {
  private navController = inject(NavController);
  private store = inject(Store);

  teas$: Observable<Tea[][]> | undefined;

  ngOnInit() {
    this.teas$ = this.store.select(selectTeasMatrix);
  }

  showDetailsPage(id: number) {
    this.navController.navigateForward(['tabs', 'tea', 'tea-details', id]);
  }
}

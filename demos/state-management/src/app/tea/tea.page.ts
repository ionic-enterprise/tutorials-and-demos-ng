import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tea } from '@app/models';
import { selectTeasMatrix } from '@app/store';
import { NavController } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
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
} from '@ionic/angular/standalone';

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
  standalone: true,
})
export class TeaPage implements OnInit {
  teas$: Observable<Array<Array<Tea>>>;

  constructor(
    private navController: NavController,
    private store: Store,
  ) {}

  ngOnInit() {
    this.teas$ = this.store.select(selectTeasMatrix);
  }

  showDetailsPage(id: number) {
    this.navController.navigateForward(['tabs', 'tea', 'tea-details', id]);
  }
}

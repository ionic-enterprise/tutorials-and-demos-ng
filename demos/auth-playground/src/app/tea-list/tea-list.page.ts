import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeaService } from '@app/core';
import { Tea } from '@app/models';
import { map, mergeMap, Observable, Subject } from 'rxjs';
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
  selector: 'app-tea-ist',
  templateUrl: 'tea-list.page.html',
  styleUrls: ['tea-list.page.scss'],
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
export class TeaListPage implements OnInit {
  private teaService = inject(TeaService);

  teas$: Observable<Tea[][]> | undefined;
  private refresh: Subject<void>;

  constructor() {
    this.refresh = new Subject();
  }

  ngOnInit(): void {
    this.teas$ = this.refresh.pipe(
      mergeMap(() => this.teaService.getAll().pipe(map((teas: Tea[]) => this.toMatrix(teas)))),
    );
  }

  ionViewDidEnter() {
    this.refresh.next();
  }

  private toMatrix(tea: Tea[]): Tea[][] {
    const matrix: Tea[][] = [];
    let row: Tea[] = [];
    tea.forEach((t) => {
      row.push(t);
      if (row.length === 4) {
        matrix.push(row);
        row = [];
      }
    });

    if (row.length) {
      matrix.push(row);
    }

    return matrix;
  }
}

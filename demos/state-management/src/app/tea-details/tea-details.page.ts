import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Tea } from '@app/models';
import { RatingComponent } from '@app/shared';
import { selectTea } from '@app/store';
import { teaDetailsChangeRating } from '@app/store/actions';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonImg,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tea-details',
  templateUrl: './tea-details.page.html',
  styleUrls: ['./tea-details.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RatingComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonImg,
  ],
  standalone: true,
})
export class TeaDetailsPage implements OnInit {
  rating: number;
  tea$: Observable<Tea>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {}

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.tea$ = this.store.select(selectTea(id)).pipe(tap((tea) => (this.rating = tea.rating)));
  }

  changeRating(tea: Tea) {
    this.store.dispatch(teaDetailsChangeRating({ tea, rating: this.rating }));
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Tea } from '@app/models';
import { RatingComponent } from '@app/shared';
import { State, selectTea } from '@app/store';
import { teaDetailsChangeRating } from '@app/store/actions';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  rating: number = 0;
  tea$: Observable<Tea | undefined> | undefined;

  constructor(
    private route: ActivatedRoute,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id') as string, 10);
    this.tea$ = this.store
      .select(selectTea(id as number))
      .pipe(tap((tea: Tea | undefined) => (this.rating = tea?.rating || 0)));
  }

  changeRating(tea: Tea) {
    this.store.dispatch(teaDetailsChangeRating({ tea, rating: this.rating }));
  }
}

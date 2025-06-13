import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TeaService } from '@app/core';
import { Tea } from '@app/models';
import { RatingComponent } from '@app/shared';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonImg,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { EMPTY, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-tea-details',
  templateUrl: './tea-details.page.html',
  styleUrls: ['./tea-details.page.scss'],
  imports: [
    AsyncPipe,
    FormsModule,
    RatingComponent,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonImg,
    IonTitle,
    IonToolbar,
  ],
})
export class TeaDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private tea = inject(TeaService);

  tea$: Observable<Tea> = EMPTY;
  rating = 0;

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id') as string, 10);
    this.tea$ = this.tea.get(id).pipe(tap((tea) => (this.rating = tea.rating)));
  }

  changeRating(tea: Tea) {
    this.tea.save({ ...tea, rating: this.rating });
  }
}

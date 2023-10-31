import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TeaService } from '@app/core';
import { Tea } from '@app/models';
import { RatingComponent } from '@app/shared';
import { IonicModule } from '@ionic/angular';
import { EMPTY, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-tea-details',
  templateUrl: './tea-details.page.html',
  styleUrls: ['./tea-details.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RatingComponent],
})
export class TeaDetailsPage implements OnInit {
  tea$: Observable<Tea> = EMPTY;
  rating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private tea: TeaService,
  ) {}

  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get('id') as string, 10);
    this.tea$ = this.tea.get(id).pipe(tap((tea) => (this.rating = tea.rating)));
  }

  changeRating(tea: Tea) {
    this.tea.save({ ...tea, rating: this.rating });
  }
}

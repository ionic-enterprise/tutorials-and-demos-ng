import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeaService } from '@app/core';
import { Tea } from '@app/models';
import { IonicModule } from '@ionic/angular';
import { map, mergeMap, Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-tea-ist',
  templateUrl: 'tea-list.page.html',
  styleUrls: ['tea-list.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TeaListPage implements OnInit {
  teas$: Observable<Array<Array<Tea>>>;
  private refresh: Subject<void>;

  constructor(private teaService: TeaService) {
    this.refresh = new Subject();
  }

  ngOnInit(): void {
    this.teas$ = this.refresh.pipe(
      mergeMap(() => this.teaService.getAll().pipe(map((teas: Array<Tea>) => this.toMatrix(teas)))),
    );
  }

  ionViewDidEnter() {
    this.refresh.next();
  }

  private toMatrix(tea: Array<Tea>): Array<Array<Tea>> {
    const matrix: Array<Array<Tea>> = [];
    let row = [];
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

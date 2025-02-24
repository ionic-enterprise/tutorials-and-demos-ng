import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TastingNote, Tea } from '@app/models';
import { RatingComponent } from '@app/shared';
import { selectTeas } from '@app/store';
import { noteSaved } from '@app/store/actions';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { close, shareOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tasting-note-editor',
  templateUrl: './tasting-note-editor.component.html',
  styleUrls: ['./tasting-note-editor.component.scss'],
  imports: [
    AsyncPipe,
    FormsModule,
    RatingComponent,
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class TastingNoteEditorComponent implements OnInit {
  @Input() note: TastingNote | undefined;

  brand = '';
  name = '';
  teaCategoryId = '';
  rating = 0;
  notes = '';

  teaCategories$: Observable<Tea[]> | undefined;

  constructor(
    private modalController: ModalController,
    private store: Store,
  ) {
    addIcons({ shareOutline, close });
  }

  get title(): string {
    return this.note ? 'Tasting Note' : 'Add New Tasting Note';
  }

  get buttonLabel(): string {
    return this.note ? 'Update' : 'Add';
  }

  get sharingIsAvailable(): boolean {
    return Capacitor.isNativePlatform();
  }

  get allowSharing(): boolean {
    return !!(this.brand && this.name && this.rating);
  }

  ngOnInit() {
    this.teaCategories$ = this.store.select(selectTeas);
    if (this.note) {
      this.brand = this.note.brand;
      this.name = this.note.name;
      this.teaCategoryId = this.note.teaCategoryId.toString();
      this.rating = this.note.rating;
      this.notes = this.note.notes;
    }
  }

  close() {
    this.modalController.dismiss();
  }

  save() {
    const note: TastingNote = {
      brand: this.brand,
      name: this.name,
      teaCategoryId: parseInt(this.teaCategoryId, 10),
      rating: this.rating,
      notes: this.notes,
    };

    if (this.note) {
      note.id = this.note.id;
    }

    this.store.dispatch(noteSaved({ note }));
    this.modalController.dismiss();
  }

  async share(): Promise<void> {
    await Share.share({
      title: `${this.brand}: ${this.name}`,
      text: `I gave ${this.brand}: ${this.name} ${this.rating} stars on the Tea Taster app`,
      dialogTitle: 'Share your tasting note',
      url: 'https://tea-taster-training.web.app',
    });
  }
}

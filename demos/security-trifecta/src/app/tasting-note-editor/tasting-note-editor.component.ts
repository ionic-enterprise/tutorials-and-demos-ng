import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TastingNotesService, TeaCategoriesService } from '@app/core';
import { TastingNote, TeaCategory } from '@app/models';
import { RatingComponent } from '@app/rating/rating.component';
import { ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonTextarea,
  IonFooter,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tasting-note-editor',
  templateUrl: './tasting-note-editor.component.html',
  styleUrls: ['./tasting-note-editor.component.scss'],
  imports: [
    FormsModule,
    RatingComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonTextarea,
    IonFooter,
  ],
})
export class TastingNoteEditorComponent implements OnInit {
  @Input() note: TastingNote | undefined;

  brand = '';
  name = '';
  teaCategoryId = '';
  rating = 0;
  notes = '';

  categories: TeaCategory[] = [];

  constructor(
    private modalController: ModalController,
    private tastingNotes: TastingNotesService,
    private teaCategories: TeaCategoriesService,
  ) {
    addIcons({ close });
  }

  get title(): string {
    return this.note ? 'Tasting Note' : 'Add New Tasting Note';
  }

  get buttonLabel(): string {
    return this.note ? 'Update' : 'Add';
  }

  ngOnInit() {
    this.categories = [...this.teaCategories.data];
    if (this.note) {
      this.brand = this.note.brand;
      this.name = this.note.name;
      this.teaCategoryId = this.note.teaCategoryId.toString();
      this.rating = this.note.rating;
      this.notes = this.note.notes;
    }
  }

  async close(): Promise<void> {
    await this.modalController.dismiss();
  }

  async save(): Promise<void> {
    await this.tastingNotes.save({
      ...this.note,
      brand: this.brand,
      name: this.name,
      teaCategoryId: parseInt(this.teaCategoryId, 10),
      rating: this.rating,
      notes: this.notes,
    });
    await this.modalController.dismiss();
  }
}

import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TastingNotesService, TeaService } from '@app/core';
import { TastingNote, Tea } from '@app/models';
import { RatingComponent } from '@app/shared';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';
import {
  IonButton,
  IonButtons,
  IonContent,
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
import { addIcons } from 'ionicons';
import { shareOutline } from 'ionicons/icons';
import { Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-tasting-note-editor',
  templateUrl: './tasting-note-editor.component.html',
  styleUrls: ['./tasting-note-editor.component.scss'],
  imports: [
    AsyncPipe,
    RatingComponent,
    ReactiveFormsModule,
    IonButton,
    IonButtons,
    IonContent,
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
  private fb = inject(FormBuilder);
  private modalController = inject(ModalController);
  private tastingNotes = inject(TastingNotesService);
  private tea = inject(TeaService);

  @Input()
  note: TastingNote | undefined;

  editorForm = this.fb.group({
    brand: ['', Validators.required],
    name: ['', Validators.required],
    teaCategoryId: new FormControl<number | undefined>(undefined, { validators: [Validators.required] }),
    rating: [0, Validators.required],
    notes: ['', Validators.required],
  });

  buttonLabel = '';
  title = '';
  teaCategories$: Observable<Tea[]> = of([]);
  mc = inject(ModalController);

  get sharingIsAvailable(): boolean {
    return Capacitor.isNativePlatform();
  }

  get allowSharing(): boolean {
    return !!(
      this.editorForm.controls.brand.value &&
      this.editorForm.controls.name.value &&
      this.editorForm.controls.rating.value
    );
  }

  constructor() {
    addIcons({ shareOutline });
  }

  close() {
    this.modalController.dismiss();
  }

  async save() {
    const note: TastingNote = {
      brand: this.editorForm.controls.brand.value as string,
      name: this.editorForm.controls.name.value as string,
      notes: this.editorForm.controls.notes.value as string,
      rating: this.editorForm.controls.rating.value as number,
      teaCategoryId: this.editorForm.controls.teaCategoryId.value as number,
    };
    if (this.note?.id) {
      note.id = this.note?.id;
    }

    this.tastingNotes
      .save(note)
      .pipe(tap(() => this.modalController.dismiss()))
      .subscribe();
  }

  async share(): Promise<void> {
    await Share.share({
      title: `${this.editorForm.controls.brand.value}: ${this.editorForm.controls.name.value}`,
      text: `I gave ${this.editorForm.controls.brand.value}: ${this.editorForm.controls.name.value} ${this.editorForm.controls.rating.value} stars on the Tea Taster app`,
      dialogTitle: 'Share your tasting note',
      url: 'https://tea-taster-training.web.app',
    });
  }

  ngOnInit() {
    this.teaCategories$ = this.tea.getAll();
    if (this.note) {
      this.editorForm.controls.brand.setValue(this.note.brand);
      this.editorForm.controls.name.setValue(this.note.name);
      this.editorForm.controls.notes.setValue(this.note.notes);
      this.editorForm.controls.rating.setValue(this.note.rating);
      this.editorForm.controls.teaCategoryId.setValue(this.note.teaCategoryId);
      this.buttonLabel = 'Update';
      this.title = 'Update Note';
    } else {
      this.buttonLabel = 'Add';
      this.title = 'Add Note';
    }
  }
}

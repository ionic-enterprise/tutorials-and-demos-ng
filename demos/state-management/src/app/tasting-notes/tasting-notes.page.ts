import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TastingNote } from '@app/models';
import { State, selectNotes } from '@app/store';
import { noteDeleted, notesPageLoaded } from '@app/store/actions';
import {
  AlertController,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Observable } from 'rxjs';
import { TastingNoteEditorComponent } from './tasting-note-editor/tasting-note-editor.component';

@Component({
  selector: 'app-tasting-notes',
  templateUrl: './tasting-notes.page.html',
  styleUrls: ['./tasting-notes.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TastingNoteEditorComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
  standalone: true,
})
export class TastingNotesPage implements OnInit {
  @ViewChild(IonList, { static: true }) list: IonList | undefined;
  notes$: Observable<Array<TastingNote>> | undefined;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private routerOutlet: IonRouterOutlet,
    private store: Store<State>,
  ) {
    addIcons({ add });
  }

  ngOnInit() {
    this.store.dispatch(notesPageLoaded());
    this.notes$ = this.store.select(selectNotes);
  }

  newNote(): Promise<void> {
    return this.displayEditor();
  }

  updateNote(note: TastingNote): Promise<void> {
    return this.displayEditor(note);
  }

  async deleteNote(note: TastingNote): Promise<void> {
    if (await this.confirmDelete()) {
      this.store.dispatch(noteDeleted({ note }));
    } else {
      if (this.list?.closeSlidingItems) {
        this.list.closeSlidingItems();
      }
    }
  }

  private async confirmDelete(): Promise<boolean> {
    const alert = await this.alertController.create({
      header: 'Remove Note',
      subHeader: 'This action cannot be undone!',
      message: 'Are you sure you want to remove this note?',
      buttons: [
        { text: 'Yes', role: 'yes' },
        { text: 'No', role: 'no' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'yes';
  }

  private async displayEditor(note?: TastingNote): Promise<void> {
    const opt = {
      component: TastingNoteEditorComponent,
      backdropDismiss: false,
      presentingElement: this.routerOutlet.nativeEl,
    };

    const modal = note
      ? await this.modalController.create({ ...opt, componentProps: { note } })
      : await this.modalController.create(opt);
    await modal.present();
  }
}

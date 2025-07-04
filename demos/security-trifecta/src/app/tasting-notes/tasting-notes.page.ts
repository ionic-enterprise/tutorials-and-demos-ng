import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AuthenticationService,
  PreferencesService,
  SessionVaultService,
  SyncService,
  TastingNotesService,
  TeaCategoriesService,
} from '@app/core';
import { TastingNote } from '@app/models';
import { TastingNoteEditorComponent } from '@app/tasting-note-editor/tasting-note-editor.component';
import {
  IonRouterOutlet,
  ModalController,
  ModalOptions,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { sync, logOutOutline, add } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonToggle,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonItemSliding,
  IonItem,
  IonLabel,
  IonItemOptions,
  IonItemOption,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tasting-notes',
  templateUrl: 'tasting-notes.page.html',
  styleUrls: ['tasting-notes.page.scss'],
  imports: [
    FormsModule,
    TastingNoteEditorComponent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonToggle,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItemSliding,
    IonItem,
    IonLabel,
    IonItemOptions,
    IonItemOption,
    IonFab,
    IonFabButton,
  ],
})
export class TastingNotesPage implements OnInit {
  private authentication = inject(AuthenticationService);
  private navController = inject(NavController);
  private modalController = inject(ModalController);
  private preferences = inject(PreferencesService);
  private routerOutlet = inject(IonRouterOutlet);
  private sessionVault = inject(SessionVaultService);
  private syncService = inject(SyncService);
  private toastController = inject(ToastController);
  private tastingNotes = inject(TastingNotesService);
  private teaCategories = inject(TeaCategoriesService);

  notes: TastingNote[] = [];
  prefersDarkMode = false;

  constructor() {
    addIcons({ sync, logOutOutline, add });
  }

  async ngOnInit(): Promise<void> {
    await this.preferences.load();
    this.prefersDarkMode = !!this.preferences.prefersDarkMode;
    this.teaCategories.refresh();
    await this.tastingNotes.refresh();
    this.notes = [...this.tastingNotes.data];
  }

  async logout(): Promise<void> {
    await this.authentication.logout();
    await this.sessionVault.clearSession();
    this.navController.navigateRoot(['/', 'login']);
  }

  async presentNoteEditor(note?: TastingNote): Promise<void> {
    let opt: ModalOptions = {
      component: TastingNoteEditorComponent,
      backdropDismiss: false,
      presentingElement: this.routerOutlet.nativeEl,
    };
    if (note) {
      opt = { ...opt, componentProps: { note } };
    }

    const modal = await this.modalController.create(opt);
    modal.present();
    await modal.onDidDismiss();
    this.notes = [...this.tastingNotes.data];
  }

  async remove(note: TastingNote): Promise<void> {
    await this.tastingNotes.remove(note);
    this.notes = [...this.tastingNotes.data];
  }

  async performSync(): Promise<void> {
    await this.syncService.execute();
    await this.tastingNotes.refresh();
    this.showSuccess();
    this.notes = [...this.tastingNotes.data];
  }

  setDarkMode() {
    this.preferences.setPrefersDarkMode(!this.prefersDarkMode);
  }

  private async showSuccess(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Sync is complete!',
      duration: 1500,
      position: 'top',
      color: 'success',
    });

    await toast.present();
  }
}

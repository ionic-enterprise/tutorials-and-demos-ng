import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TastingNoteEditorComponent } from './tasting-note-editor.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [TastingNoteEditorComponent],
  exports: [TastingNoteEditorComponent],
  imports: [CommonModule, FormsModule, IonicModule, SharedModule],
})
export class TastingNoteEditorModule {}

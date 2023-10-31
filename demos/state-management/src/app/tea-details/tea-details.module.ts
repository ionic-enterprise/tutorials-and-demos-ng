import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { IonicModule } from '@ionic/angular';
import { TeaDetailsPageRoutingModule } from './tea-details-routing.module';
import { TeaDetailsPage } from './tea-details.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, TeaDetailsPageRoutingModule],
  declarations: [TeaDetailsPage],
})
export class TeaDetailsPageModule {}

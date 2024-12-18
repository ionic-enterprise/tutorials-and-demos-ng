import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth-action-complete',
  templateUrl: './auth-action-complete.page.html',
  styleUrls: ['./auth-action-complete.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonSpinner],
})
export class AuthActionCompletePage {}

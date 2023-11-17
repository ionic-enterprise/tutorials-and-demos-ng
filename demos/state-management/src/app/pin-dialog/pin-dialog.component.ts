import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  IonLabel,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-pin-dialog',
  templateUrl: './pin-dialog.component.html',
  styleUrls: ['./pin-dialog.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonLabel,
    IonFooter,
    IonGrid,
    IonRow,
    IonCol,
  ],
  standalone: true,
})
export class PinDialogComponent implements OnInit {
  @Input() setPasscodeMode: boolean = false;

  displayPin: string = '';
  errorMessage: string = '';
  pin: string = '';
  prompt: string = '';
  title: string = '';

  private verifyPin: string = '';

  constructor(private modalController: ModalController) {
    addIcons({ close });
  }

  get disableEnter(): boolean {
    return !(this.pin.length > 2);
  }

  get disableDelete(): boolean {
    return !this.pin.length;
  }

  get disableInput(): boolean {
    return !!(this.pin.length > 8);
  }

  ngOnInit() {
    if (this.setPasscodeMode) {
      this.initSetPasscodeMode();
    } else {
      this.initUnlockMode();
    }
  }

  append(n: number) {
    this.errorMessage = '';
    this.pin = this.pin.concat(n.toString());
    this.setDisplayPin();
  }

  delete() {
    if (this.pin) {
      this.pin = this.pin.slice(0, this.pin.length - 1);
    }
    this.setDisplayPin();
  }

  enter() {
    if (this.setPasscodeMode) {
      if (!this.verifyPin) {
        this.initVerifyMode();
      } else if (this.verifyPin === this.pin) {
        this.modalController.dismiss(this.pin);
      } else {
        this.errorMessage = 'PINS do not match';
        this.initSetPasscodeMode();
      }
    } else {
      this.modalController.dismiss(this.pin);
    }
  }

  cancel() {
    this.modalController.dismiss(undefined, 'cancel');
  }

  private initSetPasscodeMode() {
    this.prompt = 'Create Session PIN';
    this.title = 'Create PIN';
    this.verifyPin = '';
    this.displayPin = '';
    this.pin = '';
  }

  private initUnlockMode() {
    this.prompt = 'Enter PIN to Unlock';
    this.title = 'Unlock';
    this.displayPin = '';
    this.pin = '';
  }

  private initVerifyMode() {
    this.prompt = 'Verify PIN';
    this.verifyPin = this.pin;
    this.displayPin = '';
    this.pin = '';
  }

  private setDisplayPin() {
    this.displayPin = '*********'.slice(0, this.pin.length);
  }
}

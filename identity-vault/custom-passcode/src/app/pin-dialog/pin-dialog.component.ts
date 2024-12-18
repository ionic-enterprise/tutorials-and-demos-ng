import { Component, Input, OnInit } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { backspace } from 'ionicons/icons';

@Component({
  selector: 'app-pin-dialog',
  templateUrl: './pin-dialog.component.html',
  styleUrls: ['./pin-dialog.component.scss'],
  imports: [
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonFooter,
    IonGrid,
    IonHeader,
    IonIcon,
    IonLabel,
    IonRow,
    IonTitle,
    IonToolbar,
  ],
})
export class PinDialogComponent implements OnInit {
  @Input() setPasscodeMode = false;

  displayPin = '';
  errorMessage = '';
  pin = '';
  prompt = '';
  title = '';

  private verifyPin = '';

  constructor(private modalController: ModalController) {
    addIcons({ backspace });
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

  remove() {
    if (this.pin) {
      this.pin = this.pin.slice(0, this.pin.length - 1);
    }
    this.setDisplayPin();
  }

  cancel() {
    this.modalController.dismiss(undefined, 'cancel');
  }

  submit() {
    if (this.setPasscodeMode) {
      this.handleSetPasscodeFlow();
    } else {
      this.handleGetPasscodeFlow();
    }
  }

  private handleGetPasscodeFlow() {
    this.modalController.dismiss(this.pin);
  }

  private handleSetPasscodeFlow() {
    if (!this.verifyPin) {
      this.initVerifyMode();
    } else if (this.verifyPin !== this.pin) {
      this.errorMessage = 'PINS do not match';
      this.initSetPasscodeMode();
    } else {
      this.modalController.dismiss(this.pin);
    }
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

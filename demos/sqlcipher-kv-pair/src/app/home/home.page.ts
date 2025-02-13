import { Component } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, removeCircleOutline, trashOutline } from 'ionicons/icons';
import { EmailMessage, EmailMessagesService } from '../core/email-messages.service';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonList, IonTitle, IonToolbar, MessageComponent],
})
export class HomePage {
  messages: EmailMessage[] = [];

  constructor(private email: EmailMessagesService) {
    addIcons({ addCircleOutline, removeCircleOutline, trashOutline });
  }

  async ionViewWillEnter() {
    this.messages = await this.email.getMessages();
  }

  async addMessage() {
    await this.email.addMessage();
    this.messages = await this.email.getMessages();
  }

  async removeAllMessages() {
    await this.email.removeAllMessages();
    this.messages = await this.email.getMessages();
  }

  async removeMessage() {
    await this.email.removeMessage();
    this.messages = await this.email.getMessages();
  }
}

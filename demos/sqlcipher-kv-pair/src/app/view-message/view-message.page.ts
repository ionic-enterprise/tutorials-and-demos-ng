import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonToolbar,
  Platform,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle } from 'ionicons/icons';
import { EmailMessage, EmailMessagesService } from '../core/email-messages.service';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, IonItem, IonIcon, IonLabel, IonNote],
})
export class ViewMessagePage implements OnInit {
  public message: EmailMessage | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private email: EmailMessagesService,
    private platform: Platform,
  ) {
    addIcons({ personCircle });
  }

  async ngOnInit() {
    const idx = parseInt(this.activatedRoute.snapshot.paramMap.get('idx') || '0', 10);
    this.message = await this.email.getMessage(idx);
    await this.email.markRead(idx);
  }

  getBackButtonText() {
    const isIos = this.platform.is('ios');
    return isIos ? 'Inbox' : '';
  }
}

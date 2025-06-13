import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
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
  private activatedRoute = inject(ActivatedRoute);
  private email = inject(EmailMessagesService);

  public message: EmailMessage | null = null;

  constructor() {
    addIcons({ personCircle });
  }

  async ngOnInit() {
    const idx = parseInt(this.activatedRoute.snapshot.paramMap.get('idx') || '0', 10);
    this.message = await this.email.getMessage(idx);
    await this.email.markRead(idx);
  }

  getBackButtonText() {
    return Capacitor.getPlatform() === 'ios' ? 'Inbox' : '';
  }
}

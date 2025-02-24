import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { IonIcon, IonItem, IonLabel, IonNote } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForward } from 'ionicons/icons';
import { EmailMessage } from '../core/email-messages.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IonItem, IonLabel, IonNote, IonIcon],
})
export class MessageComponent {
  @Input() message?: EmailMessage;
  @Input() idx?: number;

  constructor() {
    addIcons({ chevronForward });
  }

  isIos() {
    return Capacitor.getPlatform() === 'ios';
  }
}

import { Injectable } from '@angular/core';
import { format } from 'date-fns';
import { InboxStorageService } from './inbox-storage.service';

export interface EmailMessage {
  fromName: string;
  subject: string;
  date: string;
  message: string;
  isUnread: boolean;
}

const messagePool: EmailMessage[] = [
  {
    fromName: 'Matt Chorsey',
    subject: 'New event: Trip to Vegas',
    date: format(new Date(), 'MMM dd, yyyy h:mmaa'),
    message:
      "Target rich environment nobody's fault it could have been managed better. Drill down you gotta smoke test your hypothesis product launch, and nail jelly to the hothouse wall spinning our wheels rock Star/Ninja. I don't like the corporate synergy.",
    isUnread: true,
  },
  {
    fromName: 'Lauren Ruthford',
    subject: 'Long time no chat',
    date: format(new Date(), 'MMM dd, yyyy h:mmaa'),
    message:
      'Pull in ten extra bodies to help roll the tortoise upstream selling, but strategic high-level 30,000 ft view. Introduction of a tentative event rundown is attached for your reference, including other happenings on the day.',
    isUnread: true,
  },
  {
    fromName: 'Jordan Firth',
    subject: 'Report Results',
    date: format(new Date(), 'MMM dd, yyyy h:mmaa'),
    message:
      'Touch base. Game plan we need distributors to evangelize the new line to local markets, yet target rich environment, or get all your ducks in a row, so window of opportunity. Where the metal hits the meat, we need to leverage our synergies.',
    isUnread: true,
  },
  {
    fromName: 'Bill Thomas',
    subject: 'The situation',
    date: format(new Date(), 'MMM dd, yyyy h:mmaa'),
    message:
      "Net net market-facing slipstream, yet we need to get all stakeholders up to speed and in the right place synergize productive mindfulness, for let's not solutionize this right now parking lot it.",
    isUnread: true,
  },
  {
    fromName: 'Joanne Pollan',
    subject: 'Updated invitation: Swim lessons',
    date: format(new Date(), 'MMM dd, yyyy h:mmaa'),
    message:
      "Bells and whistles UI I'm sorry I replied to your emails after only three weeks, but can the site go live tomorrow anyway? The right info at the right time to the right people quick win. This vendor is incompetent.",
    isUnread: true,
  },
  {
    fromName: 'Andrea Cornerston',
    subject: 'Last minute ask',
    date: format(new Date(), 'MMM dd, yyyy h:mmaa'),
    message:
      "Spinning our wheels can we parallel path not enough bandwidth deploy. Both the angel on my left shoulder and the devil on my right are eager to go to the next board meeting and say we're ditching the business model back of the net, so it's a simple lift and shift job.",
    isUnread: true,
  },
  {
    fromName: 'Moe Chamont',
    subject: 'Family Calendar App - Version 1',
    date: format(new Date(), 'MMM dd, yyyy h:mmaa'),
    message:
      'Please advise soonest per my previous email, but run it up the flag pole. Best practices can you slack it to me? Thought shower back-end of third quarter, nor criticality. Out of the loop red flag in this space golden goose, commitment to the caus. Critical mass high touch client, hop on the bandwagon.',
    isUnread: true,
  },
  {
    fromName: 'Kelly Richardson',
    subject: 'Placeholder Headhots',
    date: format(new Date(), 'MMM dd, yyyy h:mmaa'),
    message:
      "Future-proof. It just needs more cowbell we don't want to boil the ocean, beef up. Blue sky code, yet make it a priority feed the algorithm level the playing field we need to crystallize a plan.",
    isUnread: true,
  },
];
@Injectable({
  providedIn: 'root',
})
export class EmailMessagesService {
  constructor(private inbox: InboxStorageService) {}

  async getMessages(): Promise<EmailMessage[]> {
    return [...(await this.inbox.getAll())].reverse().map((x) => x.value);
  }

  async addMessage(): Promise<void> {
    const messages = await this.inbox.getAll();
    if (messages.length < messagePool.length) {
      const dt = Date.now();
      await this.inbox.setValue(dt, { ...messagePool[messages.length], date: format(dt, 'MMM dd, yyyy h:mmaa') });
    }
  }

  async getMessage(idx: number): Promise<EmailMessage | null> {
    const keys = [...(await this.inbox.getKeys())].reverse();
    return idx < keys.length ? this.inbox.getValue(keys[idx]) : null;
  }

  async markRead(idx: number) {
    const keys = [...(await this.inbox.getKeys())].reverse();
    if (idx < keys.length) {
      const email = await this.inbox.getValue(keys[idx]);
      await this.inbox.setValue(keys[idx], { ...email, isUnread: false });
    }
  }

  async removeAllMessages() {
    await this.inbox.clear();
  }

  async removeMessage() {
    const keys = await this.inbox.getKeys();
    if (keys.length) {
      await this.inbox.removeValue(keys[keys.length - 1]);
    }
  }
}

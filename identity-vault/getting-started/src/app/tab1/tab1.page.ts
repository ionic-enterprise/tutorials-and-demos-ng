import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { SessionVaultService, UnlockMode } from '../core/session-vault.service';
import { Session } from '../models/session';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar, IonTitle],
})
export class Tab1Page implements OnInit, OnDestroy {
  private subscription: Subscription;
  session: Session | null = null;

  constructor(private sessionVault: SessionVaultService) {
    this.subscription = this.sessionVault.locked$.subscribe((lock) => (this.session = lock ? null : this.session));
  }

  async ngOnInit() {
    this.session = await this.sessionVault.getSession();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async storeSession(): Promise<void> {
    this.sessionVault.storeSession({
      email: 'test@ionic.io',
      firstName: 'Tessa',
      lastName: 'Testsmith',
      accessToken: '4abf1d79-143c-4b89-b478-19607eb5ce97',
      refreshToken: '565111b6-66c3-4527-9238-6ea2cc017126',
    });
    this.session = await this.sessionVault.getSession();
  }

  async clear(): Promise<void> {
    await this.sessionVault.clearSession();
    this.session = await this.sessionVault.getSession();
  }

  async changeUnlockMode(mode: UnlockMode) {
    await this.sessionVault.updateUnlockMode(mode);
  }

  async lock(): Promise<void> {
    this.session = null;
    await this.sessionVault.lock();
  }

  async unlock(): Promise<void> {
    this.session = await this.sessionVault.getSession();
  }
}

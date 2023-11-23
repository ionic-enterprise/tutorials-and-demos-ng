import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../core/authentication.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class Tab1Page implements OnInit {
  authenticated = false;

  constructor(private authentication: AuthenticationService) {}

  async ngOnInit() {
    await this.checkAuthentication();
  }

  async login(): Promise<void> {
    await this.authentication.login();
    await this.checkAuthentication();
  }

  async logout(): Promise<void> {
    await this.authentication.logout();
    await this.checkAuthentication();
  }

  private async checkAuthentication(): Promise<void> {
    this.authenticated = await this.authentication.isAuthenticated();
  }
}

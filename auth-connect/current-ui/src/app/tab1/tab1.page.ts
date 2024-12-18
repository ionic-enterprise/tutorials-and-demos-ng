import { Component, OnInit } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthenticationService } from './../core/authentication.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonButton, IonContent, IonHeader, IonTitle, IonToolbar],
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

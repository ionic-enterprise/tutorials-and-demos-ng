import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { AuthenticationService } from './../core/authentication.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ExploreContainerComponent],
})
export class Tab1Page implements OnInit {
  authenticated = false;

  constructor(private authentication: AuthenticationService) {}

  ngOnInit() {
    this.checkAuthentication();
  }

  async login(): Promise<void> {
    await this.authentication.login();
    this.checkAuthentication();
  }

  async logout(): Promise<void> {
    await this.authentication.logout();
    this.checkAuthentication();
  }

  private async checkAuthentication(): Promise<void> {
    this.authenticated = await this.authentication.isAuthenticated();
  }
}

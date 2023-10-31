import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthenticationService } from '@app/core';
import { IonicModule, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class LoginPage {
  loginFailed: boolean = false;

  constructor(
    private auth: AuthenticationService,
    private nav: NavController,
  ) {}

  async signIn() {
    try {
      await this.auth.login();
      this.nav.navigateRoot(['/']);
    } catch (e) {
      this.loginFailed = true;
    }
  }
}

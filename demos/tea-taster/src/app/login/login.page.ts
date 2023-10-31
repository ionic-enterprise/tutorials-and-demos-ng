import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { IonicModule, NavController } from '@ionic/angular';
import { take, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class LoginPage {
  loginFailed: boolean = false;

  get emailError(): string {
    const email = this.loginForm.controls.email;
    return email.errors?.['required'] ? 'Required' : email.errors?.['email'] ? 'Invalid format' : 'Valid';
  }

  get passwordError(): string {
    const password = this.loginForm.controls.password;
    return password.errors?.['required'] ? 'Required' : 'Valid';
  }

  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private nav: NavController,
    private sessionVault: SessionVaultService,
  ) {}

  signIn() {
    const controls = this.loginForm.controls;
    this.auth
      .login(controls.email.value as string, controls.password.value as string)
      .pipe(
        take(1),
        tap(async (session) => {
          if (session) {
            await this.sessionVault.set(session);
            this.nav.navigateRoot(['/']);
          } else {
            this.loginFailed = true;
          }
        }),
      )
      .subscribe();
  }
}

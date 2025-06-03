import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService, SessionVaultService } from '@app/core';
import { NavController } from '@ionic/angular/standalone';
import { take, tap } from 'rxjs';
import { addIcons } from 'ionicons';
import { logInOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonInput,
  IonButton,
  IonIcon,
  IonToast,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonIcon,
    IonToast,
  ],
})
export class LoginPage {
  loginFailed = false;

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
  ) {
    addIcons({ logInOutline });
  }

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

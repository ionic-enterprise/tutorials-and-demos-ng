import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    SplashScreen.hide();
  }
}

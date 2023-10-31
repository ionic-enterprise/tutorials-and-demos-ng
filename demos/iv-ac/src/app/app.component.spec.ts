import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('hides the splash screen', () => {
    spyOn(SplashScreen, 'hide');
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(SplashScreen.hide).toHaveBeenCalledTimes(1);
  });
});

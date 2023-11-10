import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SplashScreen } from '@capacitor/splash-screen';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    TestBed.overrideComponent(AppComponent, {
      add: {
        imports: [RouterTestingModule],
      },
    });
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AuthActionCompletePage } from './auth-action-complete.page';

describe('AuthActionCompletePage', () => {
  let component: AuthActionCompletePage;
  let fixture: ComponentFixture<AuthActionCompletePage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(AuthActionCompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

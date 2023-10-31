import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SessionVaultService } from '@app/core';
import { createSessionVaultServiceMock } from '@app/core/testing';
import { NavController, Platform } from '@ionic/angular';
import { createNavControllerMock, createPlatformMock } from '@test/mocks';
import { click } from '@test/util';
import { VaultControlPage } from './vault-control.page';

describe('VaultControlPage', () => {
  let component: VaultControlPage;
  let fixture: ComponentFixture<VaultControlPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VaultControlPage],
      providers: [],
    })
      .overrideProvider(NavController, { useFactory: createNavControllerMock })
      .overrideProvider(Platform, { useFactory: createPlatformMock })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock })
      .compileComponents();

    fixture = TestBed.createComponent(VaultControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on mobile', () => {
    let sessionVault: SessionVaultService;
    beforeEach(async () => {
      const platform = TestBed.inject(Platform);
      (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(true);
      await component.ionViewDidEnter();
      sessionVault = TestBed.inject(SessionVaultService);
    });

    it('sets the device vault type', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="use-device-button"]'));
      click(fixture, button.nativeElement);
      expect(sessionVault.setUnlockMode).toHaveBeenCalledTimes(1);
      expect(sessionVault.setUnlockMode).toHaveBeenCalledWith('Device');
    });

    it('sets the system passcode type', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="use-system-passcode-button"]'));
      click(fixture, button.nativeElement);
      expect(sessionVault.setUnlockMode).toHaveBeenCalledTimes(1);
      expect(sessionVault.setUnlockMode).toHaveBeenCalledWith('SystemPIN');
    });

    it('sets the custom passcode type', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="use-custom-passcode-button"]'));
      click(fixture, button.nativeElement);
      expect(sessionVault.setUnlockMode).toHaveBeenCalledTimes(1);
      expect(sessionVault.setUnlockMode).toHaveBeenCalledWith('SessionPIN');
    });

    it('sets the secure storage type', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="never-lock-button"]'));
      click(fixture, button.nativeElement);
      expect(sessionVault.setUnlockMode).toHaveBeenCalledTimes(1);
      expect(sessionVault.setUnlockMode).toHaveBeenCalledWith('NeverLock');
    });

    it('sets the in memory type', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="clear-on-lock-button"]'));
      click(fixture, button.nativeElement);
      expect(sessionVault.setUnlockMode).toHaveBeenCalledTimes(1);
      expect(sessionVault.setUnlockMode).toHaveBeenCalledWith('ForceLogin');
    });

    it('locks the vault', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="lock-vault-button"]'));
      click(fixture, button.nativeElement);
      expect(sessionVault.lock).toHaveBeenCalledTimes(1);
    });

    it('clears the vault', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="clear-vault-button"]'));
      click(fixture, button.nativeElement);
      expect(sessionVault.clear).toHaveBeenCalledTimes(1);
    });
  });
});

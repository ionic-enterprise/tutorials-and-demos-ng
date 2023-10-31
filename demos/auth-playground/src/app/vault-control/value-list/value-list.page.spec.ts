import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionVaultService } from '@app/core';
import { createSessionVaultServiceMock } from '@app/core/testing';
import { AlertController } from '@ionic/angular';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { click } from '@test/util';

import { ValueListPage } from './value-list.page';

describe('ValueListPage', () => {
  let alert: any;
  let component: ValueListPage;
  let fixture: ComponentFixture<ValueListPage>;

  beforeEach(waitForAsync(() => {
    alert = createOverlayElementMock('Alert');
    TestBed.configureTestingModule({
      imports: [ValueListPage, RouterTestingModule],
      providers: [],
    })
      .overrideProvider(AlertController, { useFactory: () => createOverlayControllerMock('AlertController', alert) })
      .overrideProvider(SessionVaultService, { useFactory: createSessionVaultServiceMock })
      .compileComponents();

    fixture = TestBed.createComponent(ValueListPage);
    component = fixture.componentInstance;
    const sessionVault = TestBed.inject(SessionVaultService);
    (sessionVault.getKeys as jasmine.Spy).and.returnValue(Promise.resolve(['foo', 'bar', 'baz']));
    (sessionVault.getValue as jasmine.Spy).withArgs('foo').and.returnValue(Promise.resolve('cat'));
    (sessionVault.getValue as jasmine.Spy).withArgs('bar').and.returnValue(Promise.resolve('dog'));
    (sessionVault.getValue as jasmine.Spy).withArgs('baz').and.returnValue(Promise.resolve('mouse'));
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('gets the keys', () => {
    const sessionVault = TestBed.inject(SessionVaultService);
    expect(sessionVault.getKeys).toHaveBeenCalledTimes(1);
  });

  it('displays the keys in a list', () => {
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('[data-testid="key-value-list"]'));
    const items = list.queryAll(By.css('ion-item'));
    expect(items.length).toEqual(3);
    expect(items[0].nativeElement.textContent).toContain('foo');
    expect(items[1].nativeElement.textContent).toContain('bar');
    expect(items[2].nativeElement.textContent).toContain('baz');
  });

  it('displays the values in the list', fakeAsync(() => {
    tick();
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('[data-testid="key-value-list"]'));
    const items = list.queryAll(By.css('ion-item'));
    expect(items.length).toEqual(3);
    expect(items[0].nativeElement.textContent).toContain('cat');
    expect(items[1].nativeElement.textContent).toContain('dog');
    expect(items[2].nativeElement.textContent).toContain('mouse');
  }));

  describe('add a value', () => {
    beforeEach(() => {
      alert.onDidDismiss.and.returnValue(
        Promise.resolve({ data: { values: { key: 'foo', value: 'this is my foo data' } }, role: undefined }),
      );
    });

    it('displays an alert', fakeAsync(() => {
      const button = fixture.debugElement.query(By.css('[data-testid="add-value-button'));
      click(fixture, button.nativeElement);
      tick();
      expect(alert.present).toHaveBeenCalledTimes(1);
    }));

    it('sets the value', fakeAsync(() => {
      alert.onDidDismiss.and.returnValue(
        Promise.resolve({ data: { values: { key: 'foo', value: 'this is my foo data' } }, role: undefined }),
      );
      const sessionVault = TestBed.inject(SessionVaultService);
      const button = fixture.debugElement.query(By.css('[data-testid="add-value-button'));
      click(fixture, button.nativeElement);
      tick();
      expect(sessionVault.setValue).toHaveBeenCalledTimes(1);
      expect(sessionVault.setValue).toHaveBeenCalledWith('foo', 'this is my foo data');
    }));

    it('does nothing if cancel', fakeAsync(() => {
      alert.onDidDismiss.and.returnValue(
        Promise.resolve({ data: { values: { key: 'foo', value: 'this is my foo data' } }, role: 'cancel' }),
      );
      const sessionVault = TestBed.inject(SessionVaultService);
      const button = fixture.debugElement.query(By.css('[data-testid="add-value-button'));
      click(fixture, button.nativeElement);
      tick();
      expect(sessionVault.setValue).not.toHaveBeenCalled();
    }));

    it('does nothing if no key', fakeAsync(() => {
      alert.onDidDismiss.and.returnValue(
        Promise.resolve({ data: { values: { key: '', value: 'this is my foo data' } }, role: undefined }),
      );
      const sessionVault = TestBed.inject(SessionVaultService);
      const button = fixture.debugElement.query(By.css('[data-testid="add-value-button'));
      click(fixture, button.nativeElement);
      tick();
      expect(sessionVault.setValue).not.toHaveBeenCalled();
    }));

    it('does nothing if no value', fakeAsync(() => {
      alert.onDidDismiss.and.returnValue(
        Promise.resolve({ data: { values: { key: 'foo', value: '' } }, role: undefined }),
      );
      const sessionVault = TestBed.inject(SessionVaultService);
      const button = fixture.debugElement.query(By.css('[data-testid="add-value-button'));
      click(fixture, button.nativeElement);
      tick();
      expect(sessionVault.setValue).not.toHaveBeenCalled();
    }));
  });
});

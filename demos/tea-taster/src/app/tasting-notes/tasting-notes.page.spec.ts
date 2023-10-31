import { fakeAsync, tick, waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TastingNotesService } from '@app/core';
import { createTastingNotesServiceMock } from '@app/core/testing';
import { TastingNote } from '@app/models';
import { AlertController, IonicModule, IonRouterOutlet, ModalController } from '@ionic/angular';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { of } from 'rxjs';
import { TastingNoteEditorComponent } from './tasting-note-editor/tasting-note-editor.component';
import { TastingNotesPage } from './tasting-notes.page';

describe('TastingNotesPage', () => {
  let component: TastingNotesPage;
  let fixture: ComponentFixture<TastingNotesPage>;
  let alert: HTMLIonAlertElement;
  let modal: HTMLIonModalElement;
  let modalController: ModalController;
  let testData: Array<TastingNote>;

  const mockRouterOutlet = {
    nativeEl: {},
  };

  beforeEach(waitForAsync(() => {
    initializeTestData();
    alert = createOverlayElementMock('Alert');
    modal = createOverlayElementMock('Modal');
    modalController = createOverlayControllerMock('ModalController', modal);
    TestBed.configureTestingModule({
      imports: [TastingNotesPage],
    })
      .overrideProvider(AlertController, { useFactory: () => createOverlayControllerMock('AlertController', alert) })
      .overrideProvider(ModalController, { useValue: modalController })
      .overrideProvider(IonRouterOutlet, { useValue: mockRouterOutlet })
      .overrideProvider(TastingNotesService, { useFactory: createTastingNotesServiceMock })
      .compileComponents();

    const tastingNotes = TestBed.inject(TastingNotesService);
    (tastingNotes.getAll as jasmine.Spy).and.returnValue(of(testData));
    fixture = TestBed.createComponent(TastingNotesPage);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('displays the notes', () => {
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('ion-item'));
    expect(items.length).toEqual(2);
    expect(items[0].nativeElement.textContent).toContain('Bentley');
    expect(items[1].nativeElement.textContent).toContain('Lipton');
  });

  describe('add new note', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('creates the editor modal', () => {
      const button = fixture.debugElement.query(By.css('[data-testid="add-new-button"]')).nativeElement;
      click(button);
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: TastingNoteEditorComponent,
        backdropDismiss: false,
        presentingElement: mockRouterOutlet.nativeEl as any,
      });
    });

    it('displays the editor modal', fakeAsync(() => {
      const button = fixture.debugElement.query(By.css('[data-testid="add-new-button"]')).nativeElement;
      click(button);
      tick();
      expect(modal.present).toHaveBeenCalledTimes(1);
    }));
  });

  describe('update an existing note', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('creates the editor modal', () => {
      const item = fixture.debugElement.query(By.css('ion-item')).nativeElement;
      click(item);
      expect(modalController.create).toHaveBeenCalledTimes(1);
      expect(modalController.create).toHaveBeenCalledWith({
        component: TastingNoteEditorComponent,
        backdropDismiss: false,
        presentingElement: mockRouterOutlet.nativeEl as any,
        componentProps: { note: testData[0] },
      });
    });

    it('displays the editor modal', fakeAsync(() => {
      const item = fixture.debugElement.query(By.css('ion-item')).nativeElement;
      click(item);
      tick();
      expect(modal.present).toHaveBeenCalledTimes(1);
    }));
  });

  describe('deleting a note', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenRenderingDone();
      (alert.onDidDismiss as jasmine.Spy).and.resolveTo({ role: 'yes' });
    });

    it('asks the user if they would like to remove the note', fakeAsync(() => {
      const buttons = fixture.debugElement.queryAll(By.css('ion-item-option'));
      click(buttons[1].nativeElement);
      tick();
      expect(alert.present).toHaveBeenCalledTimes(1);
    }));

    describe('when the user answers yes', () => {
      beforeEach(() => {
        (alert.onDidDismiss as jasmine.Spy).and.resolveTo({ role: 'yes' });
      });

      it('removes the note', fakeAsync(() => {
        const notes = TestBed.inject(TastingNotesService);
        const buttons = fixture.debugElement.queryAll(By.css('ion-item-option'));
        click(buttons[1].nativeElement);
        tick();
        expect(notes.delete).toHaveBeenCalledTimes(1);
        expect(notes.delete).toHaveBeenCalledWith(42);
      }));
    });
  });

  const click = (button: HTMLElement) => {
    const event = new Event('click');
    button.dispatchEvent(event);
    fixture.detectChanges();
  };

  const initializeTestData = () => {
    testData = [
      {
        id: 73,
        brand: 'Bentley',
        name: 'Brown Label',
        notes: 'Essentially OK',
        rating: 3,
        teaCategoryId: 2,
      },
      {
        id: 42,
        brand: 'Lipton',
        name: 'Yellow Label',
        notes: 'Overly acidic, highly tannic flavor',
        rating: 1,
        teaCategoryId: 3,
      },
    ];
  };
});

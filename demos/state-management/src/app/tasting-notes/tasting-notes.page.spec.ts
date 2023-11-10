import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TastingNote } from '@app/models';
import { selectNotes } from '@app/store';
import { noteDeleted, notesPageLoaded } from '@app/store/actions';
import { DataState, initialState } from '@app/store/reducers/data.reducer';
import { AlertController, IonRouterOutlet, ModalController } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { TastingNotesPage } from './tasting-notes.page';

describe('TastingNotesPage', () => {
  let component: TastingNotesPage;
  let fixture: ComponentFixture<TastingNotesPage>;
  let alert: HTMLIonAlertElement;
  let modal: HTMLIonModalElement;
  let testData: Array<TastingNote>;

  const mockRouterOutlet = {
    nativeEl: {},
  };

  beforeEach(waitForAsync(() => {
    initializeTestData();
    alert = createOverlayElementMock('Alert');
    modal = createOverlayElementMock('Modal');
    TestBed.configureTestingModule({
      providers: [
        provideMockStore<{ data: DataState }>({
          initialState: { data: initialState },
        }),
      ],
    })
      .overrideProvider(AlertController, { useFactory: () => createOverlayControllerMock('AlertController', alert) })
      .overrideProvider(ModalController, { useFactory: () => createOverlayControllerMock('ModalController', modal) })
      .overrideProvider(IonRouterOutlet, { useValue: mockRouterOutlet });

    const store = TestBed.inject(Store) as MockStore;
    fixture = TestBed.createComponent(TastingNotesPage);
    store.overrideSelector(selectNotes, testData);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('dispatches notes page loaded', () => {
      const store = TestBed.inject(Store);
      spyOn(store, 'dispatch');
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(notesPageLoaded());
    });

    it('displays the notes', () => {
      fixture.detectChanges();
      const items = fixture.debugElement.queryAll(By.css('ion-item'));
      expect(items.length).toEqual(2);
      expect(items[0].nativeElement.textContent).toContain('Bentley');
      expect(items[1].nativeElement.textContent).toContain('Lipton');
    });
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

      it('dispatches a delete for the note', fakeAsync(() => {
        const store = TestBed.inject(Store);
        spyOn(store, 'dispatch');
        const buttons = fixture.debugElement.queryAll(By.css('ion-item-option'));
        click(buttons[1].nativeElement);
        tick();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(
          noteDeleted({
            note: {
              id: 42,
              brand: 'Lipton',
              name: 'Yellow Label',
              notes: 'Overly acidic, highly tannic flavor',
              rating: 1,
              teaCategoryId: 3,
            },
          }),
        );
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

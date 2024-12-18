import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { selectTeas } from '@app/store';
import { DataState, initialState } from '@app/store/reducers/data.reducer';
import { Share } from '@capacitor/share';
import { ModalController, Platform } from '@ionic/angular/standalone';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createOverlayControllerMock, createPlatformMock } from '@test/mocks';
import { TastingNoteEditorComponent } from './tasting-note-editor.component';

describe('TastingNoteEditorComponent', () => {
  let component: TastingNoteEditorComponent;
  let fixture: ComponentFixture<TastingNoteEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore<{ data: DataState }>({
          initialState: { data: initialState },
        }),
      ],
    })
      .overrideProvider(ModalController, { useFactory: () => createOverlayControllerMock('ModalController') })
      .overrideProvider(Platform, { useFactory: createPlatformMock });

    const store = TestBed.inject(Store) as MockStore;
    store.overrideSelector(selectTeas, [
      {
        id: 7,
        name: 'White',
        image: 'assets/img/white.jpg',
        description: 'White tea description.',
        rating: 5,
      },
      {
        id: 8,
        name: 'Yellow',
        image: 'assets/img/yellow.jpg',
        description: 'Yellow tea description.',
        rating: 3,
      },
    ]);

    fixture = TestBed.createComponent(TastingNoteEditorComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('binds the tea select', () => {
      fixture.detectChanges();
      const sel = fixture.debugElement.query(By.css('ion-select'));
      const opts = sel.queryAll(By.css('ion-select-option'));
      expect(opts[0].nativeElement.value).toEqual('7');
      expect(opts[0].nativeElement.textContent).toEqual('White');
      expect(opts[1].nativeElement.value).toEqual('8');
      expect(opts[1].nativeElement.textContent).toEqual('Yellow');
    });

    describe('without a note', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      it('has the add title', () => {
        const el = fixture.debugElement.query(By.css('ion-title'));
        expect(el.nativeElement.textContent).toEqual('Add New Tasting Note');
      });

      it('has the add button label', () => {
        const footer = fixture.debugElement.query(By.css('ion-footer'));
        const el = footer.query(By.css('ion-button'));
        expect(el.nativeElement.textContent).toEqual('Add');
      });
    });

    describe('with a note', () => {
      beforeEach(() => {
        component.note = {
          id: 7,
          brand: 'Lipton',
          name: 'Yellow Label',
          notes: 'Overly acidic, highly tannic flavor',
          rating: 1,
          teaCategoryId: 3,
        };
        fixture.detectChanges();
      });

      it('sets the properties', () => {
        expect(component.brand).toEqual('Lipton');
        expect(component.name).toEqual('Yellow Label');
        expect(component.notes).toEqual('Overly acidic, highly tannic flavor');
        expect(component.rating).toEqual(1);
        expect(component.teaCategoryId).toEqual('3');
      });

      it('has the update title', () => {
        const el = fixture.debugElement.query(By.css('ion-title'));
        expect(el.nativeElement.textContent).toEqual('Tasting Note');
      });

      it('has the update button label', () => {
        const footer = fixture.debugElement.query(By.css('ion-footer'));
        const el = footer.query(By.css('ion-button'));
        expect(el.nativeElement.textContent).toEqual('Update');
      });
    });
  });

  describe('share', () => {
    describe('in a web context', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(false);
        fixture.detectChanges();
      });

      it('is not available', () => {
        expect(fixture.debugElement.query(By.css('#share-button'))).toBeFalsy();
      });
    });

    describe('in a mobile context', () => {
      beforeEach(() => {
        const platform = TestBed.inject(Platform);
        (platform.is as jasmine.Spy).withArgs('hybrid').and.returnValue(true);
        fixture.detectChanges();
      });

      it('is available', () => {
        expect(fixture.debugElement.query(By.css('#share-button'))).toBeTruthy();
      });

      it('is not allowed until a brand, name, and rating have all been entered', () => {
        const button = fixture.debugElement.query(By.css('#share-button'));
        expect(button.nativeElement.disabled).toBeTrue();

        component.brand = 'Lipton';
        fixture.detectChanges();
        expect(button.nativeElement.disabled).toBeTrue();

        component.name = 'Yellow Label';
        fixture.detectChanges();
        expect(button.nativeElement.disabled).toBeTrue();

        component.rating = 2;
        fixture.detectChanges();
        expect(button.nativeElement.disabled).toBeFalse();
      });

      it('calls the share plugin when clicked', async () => {
        spyOn(Share, 'share');
        const button = fixture.debugElement.query(By.css('#share-button'));

        component.brand = 'Lipton';
        component.name = 'Yellow Label';
        component.rating = 2;

        const event = new Event('click');
        button.nativeElement.dispatchEvent(event);
        fixture.detectChanges();

        expect(Share.share).toHaveBeenCalledTimes(1);
        expect(Share.share).toHaveBeenCalledWith({
          title: 'Lipton: Yellow Label',
          text: 'I gave Lipton: Yellow Label 2 stars on the Tea Taster app',
          dialogTitle: 'Share your tasting note',
          url: 'https://tea-taster-training.web.app',
        });
      });
    });
  });
});

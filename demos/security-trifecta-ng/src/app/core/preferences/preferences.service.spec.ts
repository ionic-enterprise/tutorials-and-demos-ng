import { TestBed } from '@angular/core/testing';
import { StorageService } from '../storage/storage.service';
import { createStorageServiceMock } from '../testing';
import { PreferencesService } from './preferences.service';

describe('PreferencesService', () => {
  let service: PreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useFactory: createStorageServiceMock }],
    });
    service = TestBed.inject(PreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load', () => {
    it('loads the dark mode preference', async () => {
      const storage = TestBed.inject(StorageService);
      await service.load();
      expect(storage.get).toHaveBeenCalledTimes(1);
      expect(storage.get).toHaveBeenCalledWith('prefersDarkMode');
    });

    it('sets the dark mode preferences based on what is loaded', async () => {
      const storage = TestBed.inject(StorageService);
      (storage.get as jasmine.Spy).and.returnValue(Promise.resolve(null));
      await service.load();
      expect(service.prefersDarkMode).toBe(false);
      (storage.get as jasmine.Spy).and.returnValue(Promise.resolve(true));
      await service.load();
      expect(service.prefersDarkMode).toBe(true);
      (storage.get as jasmine.Spy).and.returnValue(Promise.resolve(false));
      await service.load();
      expect(service.prefersDarkMode).toBe(false);
    });

    it('emits the preferences changed', async () => {
      let fired = 0;
      service.preferencesChanged$.subscribe(() => fired++);
      expect(fired).toBe(0);
      await service.load();
      expect(fired).toBe(1);
    });
  });

  describe('setting the dark mode preference', () => {
    it('sets the dark mode value', async () => {
      await service.setPrefersDarkMode(true);
      expect(service.prefersDarkMode).toBe(true);
      await service.setPrefersDarkMode(false);
      expect(service.prefersDarkMode).toBe(false);
    });

    it('stores the value', async () => {
      const storage = TestBed.inject(StorageService);
      await service.setPrefersDarkMode(true);
      expect(storage.set).toHaveBeenCalledTimes(1);
      expect(storage.set).toHaveBeenCalledWith('prefersDarkMode', true);
    });

    it('emits the preferences changed', async () => {
      let fired = 0;
      service.preferencesChanged$.subscribe(() => fired++);
      expect(fired).toBe(0);
      await service.setPrefersDarkMode(true);
      expect(fired).toBe(1);
      await service.setPrefersDarkMode(false);
      expect(fired).toBe(2);
    });
  });
});

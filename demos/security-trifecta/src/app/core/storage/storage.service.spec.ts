import { TestBed } from '@angular/core/testing';
import { Capacitor } from '@capacitor/core';
import { KeyValueStorage } from '@ionic-enterprise/secure-storage/ngx';
import { EncryptionService } from '../encryption/encryption.service';
import { createEncryptionServiceMock } from '../testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.overrideProvider(EncryptionService, { useFactory: createEncryptionServiceMock }).overrideProvider(
      KeyValueStorage,
      {
        useFactory: () =>
          jasmine.createSpyObj('KeyValueStorage', {
            create: Promise.resolve(),
            get: Promise.resolve(),
            set: Promise.resolve(),
          }),
      },
    );
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('on web', () => {
    beforeEach(() => {
      spyOn(Capacitor, 'isNativePlatform').and.returnValue(false);
    });

    it('creates the storage without a key on the first call (set)', async () => {
      const kvs = TestBed.inject(KeyValueStorage);
      await service.set('key', 'value');
      expect(kvs.create).toHaveBeenCalledTimes(1);
      expect(kvs.create).toHaveBeenCalledWith('');
      await service.set('key', 'value');
      expect(kvs.create).toHaveBeenCalledTimes(1);
      await service.get('key');
      expect(kvs.create).toHaveBeenCalledTimes(1);
    });

    it('creates the storage without a key on the first call (get)', async () => {
      const kvs = TestBed.inject(KeyValueStorage);
      await service.get('key');
      expect(kvs.create).toHaveBeenCalledTimes(1);
      expect(kvs.create).toHaveBeenCalledWith('');
      await service.get('key');
      expect(kvs.create).toHaveBeenCalledTimes(1);
      await service.set('key', 'value');
      expect(kvs.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('on mobile', () => {
    beforeEach(() => {
      spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);
    });

    it('creates the storage without a key on the first call (set)', async () => {
      const encryption = TestBed.inject(EncryptionService);
      (encryption.getDatabaseKey as jasmine.Spy).and.returnValue('ThisIsTheDatabaseKey');
      const kvs = TestBed.inject(KeyValueStorage);
      await service.set('key', 'value');
      expect(encryption.getDatabaseKey).toHaveBeenCalledTimes(1);
      expect(kvs.create).toHaveBeenCalledTimes(1);
      expect(kvs.create).toHaveBeenCalledWith('ThisIsTheDatabaseKey');
      await service.set('key', 'value');
      expect(encryption.getDatabaseKey).toHaveBeenCalledTimes(1);
      expect(kvs.create).toHaveBeenCalledTimes(1);
      await service.get('key');
      expect(encryption.getDatabaseKey).toHaveBeenCalledTimes(1);
      expect(kvs.create).toHaveBeenCalledTimes(1);
    });

    it('creates the storage without a key on the first call (get)', async () => {
      const encryption = TestBed.inject(EncryptionService);
      (encryption.getDatabaseKey as jasmine.Spy).and.returnValue('ThisIsTheDatabaseKey');
      const kvs = TestBed.inject(KeyValueStorage);
      await service.get('key');
      expect(encryption.getDatabaseKey).toHaveBeenCalledTimes(1);
      expect(kvs.create).toHaveBeenCalledTimes(1);
      expect(kvs.create).toHaveBeenCalledWith('ThisIsTheDatabaseKey');
      await service.get('key');
      expect(encryption.getDatabaseKey).toHaveBeenCalledTimes(1);
      expect(kvs.create).toHaveBeenCalledTimes(1);
      await service.set('key', 'value');
      expect(encryption.getDatabaseKey).toHaveBeenCalledTimes(1);
      expect(kvs.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('set', () => {
    it('sets the value', async () => {
      const kvs = TestBed.inject(KeyValueStorage);
      await service.set('key', 'value');
      expect(kvs.set).toHaveBeenCalledTimes(1);
      expect(kvs.set).toHaveBeenCalledWith('key', 'value');
    });
  });

  describe('get', () => {
    it('gets the value', async () => {
      const kvs = TestBed.inject(KeyValueStorage);
      (kvs.get as jasmine.Spy).and.returnValue(Promise.resolve('value'));
      expect(await service.get('key')).toBe('value');
      expect(kvs.get).toHaveBeenCalledTimes(1);
      expect(kvs.get).toHaveBeenCalledWith('key');
    });
  });
});

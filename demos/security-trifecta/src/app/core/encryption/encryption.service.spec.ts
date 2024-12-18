import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { environment } from '@env/environment';
import { DeviceSecurityType, Vault, VaultType } from '@ionic-enterprise/identity-vault';
import { VaultFactoryService } from '../vault-factory/vault-factory.service';
import { EncryptionService } from './encryption.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EncryptionService', () => {
  let httpTestingController: HttpTestingController;
  let mockVault: Vault;
  let service: EncryptionService;

  beforeEach(() => {
    const vaultObject = {
      clear: Promise.resolve(),
      getKeys: Promise.resolve([]),
      getValue: Promise.resolve(),
      initialize: Promise.resolve(),
      isEmpty: Promise.resolve(false),
      isLocked: Promise.resolve(false),
      lock: Promise.resolve(),
      setCustomPasscode: Promise.resolve(),
      setValue: Promise.resolve(),
      updateConfig: Promise.resolve(),
      unlock: Promise.resolve(),
      onLock: undefined,
      onUnlock: undefined,
      onPasscodeRequested: undefined,
    };
    mockVault = jasmine.createSpyObj<Vault>('Vault', { ...vaultObject });
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).overrideProvider(VaultFactoryService, {
      useValue: jasmine.createSpyObj('VaultFactoryService', {
        create: mockVault,
      }),
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize', () => {
    it('initializes the vault', async () => {
      await service.initialize();
      expect(mockVault.initialize).toHaveBeenCalledOnceWith({
        key: 'io.ionic.csdemosecurestoragekeys',
        type: VaultType.SecureStorage,
        deviceSecurityType: DeviceSecurityType.None,
        unlockVaultOnLoad: false,
      });
    });
  });

  describe('after initialization', () => {
    beforeEach(async () => {
      await service.initialize();
    });

    describe('get database key', () => {
      beforeEach(() => {
        (mockVault.getValue as jasmine.Spy).and.returnValue(Promise.resolve('4293005940030-3994'));
      });

      it('checks the vault', async () => {
        await service.getDatabaseKey();
        expect(mockVault.getValue).toHaveBeenCalledTimes(1);
        expect(mockVault.getValue).toHaveBeenCalledWith('database-key');
      });

      describe('when the key is in the vault', () => {
        beforeEach(() => {
          (mockVault.getValue as jasmine.Spy).and.returnValue(Promise.resolve('4293005940030-3994'));
        });

        it('returns the key value', async () => {
          expect(await service.getDatabaseKey()).toEqual('4293005940030-3994');
        });

        it('does not call the backend API', async () => {
          await service.getDatabaseKey();
          httpTestingController.verify();
          expect(true).toBe(true); // avoids test warning
        });
      });

      describe('when the key is not in the vault', () => {
        beforeEach(() => {
          (mockVault.getValue as jasmine.Spy).and.returnValue(Promise.resolve(null));
        });

        it('gets the key from the backend API', fakeAsync(() => {
          service.getDatabaseKey();
          tick();
          const req = httpTestingController.expectOne(`${environment.dataService}/keys`);
          expect(req.request.method).toEqual('GET');
          req.flush({ storage: 'fiir99502939kd0-9304' });
        }));

        it('stores the key', fakeAsync(() => {
          service.getDatabaseKey();
          tick();
          const req = httpTestingController.expectOne(`${environment.dataService}/keys`);
          req.flush({ storage: 'fiir99502939kd0-9304' });
          tick();
          expect(mockVault.setValue).toHaveBeenCalledTimes(1);
          expect(mockVault.setValue).toHaveBeenCalledWith('database-key', 'fiir99502939kd0-9304');
        }));

        it('returns the key', fakeAsync(() => {
          let key = '';
          service.getDatabaseKey().then((k) => (key = k));
          tick();
          const req = httpTestingController.expectOne(`${environment.dataService}/keys`);
          req.flush({ storage: 'fiir99502939kd0-9304' });
          tick();
          expect(key).toEqual('fiir99502939kd0-9304');
        }));
      });
    });
  });
});

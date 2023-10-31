import { VaultType } from '@ionic-enterprise/identity-vault';
import { VaultTypePipe } from './vault-type.pipe';

describe('VaultTypePipe', () => {
  const pipe = new VaultTypePipe();

  it('returns an empty string with no data', () => {
    expect(pipe.transform(null)).toEqual('');
    expect(pipe.transform(undefined)).toEqual('');
  });

  it('returns a proper value for each type', () => {
    expect(pipe.transform(VaultType.CustomPasscode)).toEqual('Custom Passcode');
    expect(pipe.transform(VaultType.DeviceSecurity)).toEqual('Device');
    expect(pipe.transform(VaultType.InMemory)).toEqual('In Memory');
    expect(pipe.transform(VaultType.SecureStorage)).toEqual('Secure Storage');
  });
});

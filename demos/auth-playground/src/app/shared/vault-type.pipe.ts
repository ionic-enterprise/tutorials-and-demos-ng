import { Pipe, PipeTransform } from '@angular/core';
import { VaultType } from '@ionic-enterprise/identity-vault';

@Pipe({
  name: 'vaultType',
  standalone: true,
})
export class VaultTypePipe implements PipeTransform {
  transform(value?: VaultType): string {
    let result = '';
    switch (value) {
      case VaultType.CustomPasscode:
        result = 'Custom Passcode';
        break;

      case VaultType.DeviceSecurity:
        result = 'Device';
        break;

      case VaultType.InMemory:
        result = 'In Memory';
        break;

      case VaultType.SecureStorage:
        result = 'Secure Storage';
        break;

      default:
        break;
    }
    return result;
  }
}

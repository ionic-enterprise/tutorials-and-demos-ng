import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncryptionKeysService {
  // In a real application, you would likely generate this if it did not exist and
  // then store it somewhere secure such as in Identity Vault or on your backend API.
  //
  // For this demo, we just use a hard coded value to avoid those complications, but
  // DO NOT do this in a real app. If you do, you may as well just not use encryption.
  getDatabaseKey() {
    return 'b3d2915f-01a6-4075-b7b4-5363499d6ba7';
  }
}

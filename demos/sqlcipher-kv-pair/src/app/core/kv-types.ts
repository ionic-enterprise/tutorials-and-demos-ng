export type KeyValueCollection = 'inbox';

export type KeyValueKey = string | number;

export interface KeyValuePair {
  key: KeyValueKey;
  value: any;
}

export interface KVStorageProvider {
  clear: () => Promise<void>;
  getAll: () => Promise<KeyValuePair[]>;
  getValue: (key: KeyValueKey) => Promise<any | undefined>;
  removeValue: (key: KeyValueKey) => Promise<void>;
  setValue: (key: KeyValueKey, value: any) => Promise<void>;
  getKeys: () => Promise<KeyValueKey[]>;
}

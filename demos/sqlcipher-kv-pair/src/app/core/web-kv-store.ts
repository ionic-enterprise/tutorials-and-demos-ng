import { KeyValueCollection, KeyValueKey, KeyValuePair, KVStorageProvider } from './kv-types';

const initialize = (): Promise<IDBDatabase> => {
  const request = indexedDB.open('web-kv-store', 1);

  request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
    const db = (event as any).target.result as IDBDatabase;
    db.onerror = (evt: unknown) => console.error('Error in indexDB KV store', evt);
    db.createObjectStore('inbox', { keyPath: 'key' });
  };

  return new Promise((resolve, reject) => {
    request.onerror = (evt: unknown) => reject(evt);
    request.onsuccess = (evt: any) => {
      resolve(evt.target.result as IDBDatabase);
    };
  });
};

const dbInstance = initialize();

export class WebKVStore implements KVStorageProvider {
  constructor(private collection: KeyValueCollection) {}

  async clear(): Promise<void> {
    const db = await dbInstance;
    return new Promise((resolve) => {
      const dataObjectStore = db.transaction(this.collection, 'readwrite').objectStore(this.collection);
      const req = dataObjectStore.clear();
      req.onsuccess = () => resolve();
    });
  }

  async getAll(): Promise<KeyValuePair[]> {
    const db = await dbInstance;
    return new Promise((resolve) => {
      const dataObjectStore = db.transaction(this.collection, 'readonly').objectStore(this.collection);
      const req = dataObjectStore.getAll();
      req.onsuccess = (evt: any) => resolve(evt.target.result || []);
    });
  }

  async getValue(key: KeyValueKey): Promise<any | undefined> {
    const db = await dbInstance;
    return new Promise((resolve) => {
      const dataObjectStore = db.transaction(this.collection, 'readonly').objectStore(this.collection);
      const req = dataObjectStore.get(key);
      req.onsuccess = (evt: any) => resolve(evt.target.result?.value);
    });
  }

  async removeValue(key: KeyValueKey): Promise<void> {
    const db = await dbInstance;
    return new Promise((resolve) => {
      const dataObjectStore = db.transaction(this.collection, 'readwrite').objectStore(this.collection);
      const req = dataObjectStore.delete(key);
      req.onsuccess = () => resolve();
    });
  }

  async setValue(key: KeyValueKey, value: any): Promise<void> {
    const db = await dbInstance;
    return new Promise((resolve) => {
      const dataObjectStore = db.transaction(this.collection, 'readwrite').objectStore(this.collection);
      const req = dataObjectStore.put({ key, value });
      req.onsuccess = () => resolve();
    });
  }

  async getKeys(): Promise<KeyValueKey[]> {
    const db = await dbInstance;
    return new Promise((resolve) => {
      const dataObjectStore = db.transaction(this.collection, 'readonly').objectStore(this.collection);
      const req = dataObjectStore.getAllKeys();
      req.onsuccess = (evt: any) => resolve(evt.target.result);
    });
  }
}

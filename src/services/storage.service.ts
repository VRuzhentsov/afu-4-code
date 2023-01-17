import {Storage} from '@ionic/storage';

export default class StorageService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage({
      name: 'afu-4-code-storage',
    });
    this.storage.create();
  }

  async get(key: string): Promise<any> {
    return this.storage.get(key);
  }

  async set(key: string, value: any): Promise<any> {
    return this.storage.set(key, value);
  }

  async remove(key: string): Promise<void> {
    return this.storage.remove(key);
  }

  async clear(): Promise<void> {
    return this.storage.clear();
  }
}

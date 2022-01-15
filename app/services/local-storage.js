import Service from '@ember/service';

export default class LocalStorageService extends Service {
  implementation = localStorage;

  setItem(key, value) {
    this.implementation.setItem(key, value);
  }

  getItem(key) {
    return this.implementation.getItem(key);
  }

  removeItem(key) {
    this.implementation.removeItem(key);
  }

  clear() {
    this.implementation.clear();
  }
}

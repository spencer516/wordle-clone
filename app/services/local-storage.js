import Service from '@ember/service';

export default class LocalStorageService extends Service {
  implementation = localStorage;

  setItem(key, value) {
    this.implementation.setItem(key, JSON.stringify(value));
  }

  getItem(key) {
    const value = this.implementation.getItem(key);
    return value !== null && value !== undefined ? JSON.parse(value) : value;
  }

  removeItem(key) {
    this.implementation.removeItem(key);
  }

  clear() {
    this.implementation.clear();
  }
}

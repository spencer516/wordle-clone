class LocalStorageStub {
  data = new Map();

  setItem(key, value) {
    this.data.set(key, String(value));
  }

  getItem(key) {
    return this.data.get(key);
  }

  removeItem(key) {
    this.data.delete(key);
  }

  clear() {
    this.data = new Map();
  }
}

export default function setupLocalStorage(hooks) {
  hooks.beforeEach(function () {
    const localStorageService = this.owner.lookup('service:local-storage');
    localStorageService.implementation = this.localStorageStub =
      new LocalStorageStub();
  });
}

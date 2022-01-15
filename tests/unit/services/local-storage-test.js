import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupLocalStorage from '../../helpers/stub-local-storage';

module('Unit | Service | local-storage', function (hooks) {
  setupTest(hooks);
  setupLocalStorage(hooks);

  test('can stub local storage implementation', function (assert) {
    this.localStorageStub.setItem('foo', JSON.stringify({ foo: 'bar' }));

    const service = this.owner.lookup('service:local-storage');
    assert.deepEqual(service.getItem('foo'), { foo: 'bar' });
  });
});

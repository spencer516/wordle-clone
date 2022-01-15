import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import click from '@ember/test-helpers/dom/click';

module('Integration | Component | keyboard-letter', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.onClick = sinon.stub();

    await render(hbs`<KeyboardLetter @letter='F' @onClick={{this.onClick}} />`);

    assert.dom('[data-test-keyboard-letter]').hasText('F');

    await click('[data-test-keyboard-letter]');

    assert.ok(this.onClick.getCall(0).calledWith('F'));
  });
});

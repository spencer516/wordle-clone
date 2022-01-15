import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { triggerKeyEvent } from '@ember/test-helpers';
import sinon from 'sinon';

module('Integration | Modifier | document-keyboard', function (hooks) {
  setupRenderingTest(hooks);

  // Replace this with your real tests.
  test('it handles actions correctly', async function (assert) {
    this.onCharacter = sinon.stub();
    this.onDelete = sinon.stub();
    this.onEnter = sinon.stub();

    await render(hbs`
      <div
        {{document-keyboard
          onCharacter=this.onCharacter
          onDelete=this.onDelete
          onEnter=this.onEnter
        }}
      ></div>
    `);

    await triggerKeyEvent(document, 'keydown', 'A');
    await triggerKeyEvent(document, 'keydown', 'D');

    assert.ok(this.onCharacter.getCall(0).calledWithExactly('A'));
    assert.ok(this.onCharacter.getCall(1).calledWithExactly('D'));

    await triggerKeyEvent(document, 'keydown', 'Enter');

    assert.ok(this.onEnter.calledOnce);

    await triggerKeyEvent(document, 'keydown', 'Backspace');

    assert.ok(this.onDelete.calledOnce);
  });
});

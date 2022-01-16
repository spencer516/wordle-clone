import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { triggerKeyEvent, waitFor } from '@ember/test-helpers';
import setupLocalStorage from '../../helpers/stub-local-storage';
import setupTestServer from '../../helpers/setup-test-server';

module('Integration | Component | wordle-game', function (hooks) {
  setupRenderingTest(hooks);
  setupLocalStorage(hooks);
  setupTestServer(hooks);

  test('standard game flow', async function (assert) {
    this.createGame('9as8d7', 'PANIC');

    await render(hbs`<WordleGame />`);

    await triggerKeyEvent(document, 'keydown', 'P');
    await triggerKeyEvent(document, 'keydown', 'I');
    await triggerKeyEvent(document, 'keydown', 'L');
    await triggerKeyEvent(document, 'keydown', 'E');
    await triggerKeyEvent(document, 'keydown', 'D');

    // Assert letters are PILED
    assert.dom('[data-test-letter-coordinates="0,0"]').hasText('P');
    assert.dom('[data-test-letter-coordinates="0,1"]').hasText('I');
    assert.dom('[data-test-letter-coordinates="0,2"]').hasText('L');
    assert.dom('[data-test-letter-coordinates="0,3"]').hasText('E');
    assert.dom('[data-test-letter-coordinates="0,4"]').hasText('D');

    await triggerKeyEvent(document, 'keydown', 'Backspace');
    await triggerKeyEvent(document, 'keydown', 'Backspace');

    // Assert letters are PIL
    assert.dom('[data-test-letter-coordinates="0,0"]').hasText('P');
    assert.dom('[data-test-letter-coordinates="0,1"]').hasText('I');
    assert.dom('[data-test-letter-coordinates="0,2"]').hasText('L');
    assert.dom('[data-test-letter-coordinates="0,3"]').hasNoText();
    assert.dom('[data-test-letter-coordinates="0,4"]').hasNoText();

    await triggerKeyEvent(document, 'keydown', 'O');
    await triggerKeyEvent(document, 'keydown', 'T');

    assert.dom('[data-test-letter-coordinates="0,3"]').hasText('O');
    assert.dom('[data-test-letter-coordinates="0,4"]').hasText('T');

    await triggerKeyEvent(document, 'keydown', 'Enter');

    await waitFor('[data-test-letter-coordinates="0,0"].bg-green-600');

    await triggerKeyEvent(document, 'keydown', 'P');
    await triggerKeyEvent(document, 'keydown', 'A');
    await triggerKeyEvent(document, 'keydown', 'N');
    await triggerKeyEvent(document, 'keydown', 'I');
    await triggerKeyEvent(document, 'keydown', 'C');

    assert.dom('[data-test-letter-coordinates="1,0"]').hasText('P');
    assert.dom('[data-test-letter-coordinates="1,1"]').hasText('A');
    assert.dom('[data-test-letter-coordinates="1,2"]').hasText('N');
    assert.dom('[data-test-letter-coordinates="1,3"]').hasText('I');
    assert.dom('[data-test-letter-coordinates="1,4"]').hasText('C');

    await triggerKeyEvent(document, 'keydown', 'Enter');

    await waitFor('[data-test-success-toast]');

    assert.dom('[data-test-success-toast]').exists();

    await triggerKeyEvent(document, 'keydown', 'F');

    assert.dom('[data-test-letter-coordinates="2,0"]').hasNoText();
  });

  test('guessing an non-existent word', async function (assert) {
    this.createGame('9as8d7', 'PANIC', ['PANIC', 'CHATS']);

    await render(hbs`<WordleGame />`);

    await triggerKeyEvent(document, 'keydown', 'P');
    await triggerKeyEvent(document, 'keydown', 'I');
    await triggerKeyEvent(document, 'keydown', 'L');
    await triggerKeyEvent(document, 'keydown', 'E');
    await triggerKeyEvent(document, 'keydown', 'D');

    await triggerKeyEvent(document, 'keydown', 'Enter');

    await waitFor('[data-test-error-toast]');

    assert.dom('[data-test-error-toast]').exists();
  });
});

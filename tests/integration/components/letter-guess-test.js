import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | letter-guess', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a letter', async function (assert) {
    this.letter = 'F';

    await render(hbs`<LetterGuess @letter={{this.letter}} />`);

    assert.dom('[data-test-letter-guess]').hasText('F');

    this.set('letter', 'M');

    assert.dom('[data-test-letter-guess]').hasText('M');
  });

  test('it renders styles according to state', async function (assert) {
    // 1. Plain
    // 2. Plain w/Letter
    // 3. Guessed
    // 4. Wrong Location
    // 5. Correct Location

    this.letter = '';
    this.guessState = 'pending';

    await render(
      hbs`<LetterGuess @letter={{this.letter}} @guessState={{this.guessState}} />`
    );

    assert
      .dom('[data-test-letter-guess]')
      .hasClass('border-2')
      .hasClass('border-zinc-700');

    this.set('letter', 'T');

    assert
      .dom('[data-test-letter-guess]')
      .hasClass('border-2')
      .hasClass('border-zinc-500');

    this.set('guessState', 'incorrect');

    assert
      .dom('[data-test-letter-guess]')
      .hasClass('bg-zinc-700')
      .doesNotHaveClass('border-2');

    this.set('guessState', 'wrong-location');

    assert
      .dom('[data-test-letter-guess]')
      .hasClass('bg-yellow-500')
      .doesNotHaveClass('border-2');

    this.set('guessState', 'correct');

    assert
      .dom('[data-test-letter-guess]')
      .hasClass('bg-green-600')
      .doesNotHaveClass('border-2');
  });
});

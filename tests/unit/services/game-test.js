import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupLocalStorage from '../../helpers/stub-local-storage';
import setupTestServer from '../../helpers/setup-test-server';

module('Unit | Service | game', function (hooks) {
  setupTest(hooks);
  setupLocalStorage(hooks);
  setupTestServer(hooks);

  hooks.beforeEach(function () {
    this.service = this.owner.lookup('service:game');
  });

  test('brand-new game flow', async function (assert) {
    this.createGame('9as8d7', 'PANIC');

    let game = await this.service.fetchGame();

    assert.deepEqual(game, {
      gameKey: '9as8d7',
      guesses: [],
    });

    assert.deepEqual(
      this.localStorage.getItem('active-game-data'),
      game,
      'Game was persisted to local storage'
    );

    game = await this.service.makeGuess('PILOT');

    assert.deepEqual(game, {
      gameKey: '9as8d7',
      guesses: [
        {
          letters: [
            { letter: 'P', status: 'correct' },
            { letter: 'I', status: 'wrong-location' },
            { letter: 'L', status: 'incorrect' },
            { letter: 'O', status: 'incorrect' },
            { letter: 'T', status: 'incorrect' },
          ],
        },
      ],
    });

    assert.deepEqual(
      this.localStorage.getItem('active-game-data'),
      game,
      'Game was persisted to local storage'
    );

    game = await this.service.makeGuess('PANIC');

    assert.deepEqual(game, {
      gameKey: '9as8d7',
      guesses: [
        {
          letters: [
            { letter: 'P', status: 'correct' },
            { letter: 'I', status: 'wrong-location' },
            { letter: 'L', status: 'incorrect' },
            { letter: 'O', status: 'incorrect' },
            { letter: 'T', status: 'incorrect' },
          ],
        },
        {
          letters: [
            { letter: 'P', status: 'correct' },
            { letter: 'A', status: 'correct' },
            { letter: 'N', status: 'correct' },
            { letter: 'I', status: 'correct' },
            { letter: 'C', status: 'correct' },
          ],
        },
      ],
    });

    assert.deepEqual(
      this.localStorage.getItem('active-game-data'),
      game,
      'Game was persisted to local storage'
    );
  });

  test('existing game flow', async function (assert) {
    this.createGame('9as8d7', 'PANIC');

    this.localStorage.setItem('active-game-data', {
      gameKey: '9as8d7',
      guesses: [
        {
          letters: [
            { letter: 'P', status: 'correct' },
            { letter: 'I', status: 'wrong-location' },
            { letter: 'L', status: 'incorrect' },
            { letter: 'O', status: 'incorrect' },
            { letter: 'T', status: 'incorrect' },
          ],
        },
      ],
    });

    let game = await this.service.fetchGame();

    assert.deepEqual(game, {
      gameKey: '9as8d7',
      guesses: [
        {
          letters: [
            { letter: 'P', status: 'correct' },
            { letter: 'I', status: 'wrong-location' },
            { letter: 'L', status: 'incorrect' },
            { letter: 'O', status: 'incorrect' },
            { letter: 'T', status: 'incorrect' },
          ],
        },
      ],
    });

    assert.deepEqual(
      this.localStorage.getItem('active-game-data'),
      game,
      'Game was persisted to local storage'
    );

    game = await this.service.makeGuess('PANIC');

    assert.deepEqual(game, {
      gameKey: '9as8d7',
      guesses: [
        {
          letters: [
            { letter: 'P', status: 'correct' },
            { letter: 'I', status: 'wrong-location' },
            { letter: 'L', status: 'incorrect' },
            { letter: 'O', status: 'incorrect' },
            { letter: 'T', status: 'incorrect' },
          ],
        },
        {
          letters: [
            { letter: 'P', status: 'correct' },
            { letter: 'A', status: 'correct' },
            { letter: 'N', status: 'correct' },
            { letter: 'I', status: 'correct' },
            { letter: 'C', status: 'correct' },
          ],
        },
      ],
    });

    assert.deepEqual(
      this.localStorage.getItem('active-game-data'),
      game,
      'Game was persisted to local storage'
    );
  });

  test('existing stale game flow', async function (assert) {
    this.createGame('ba89d7g', 'ABBEY');

    this.localStorage.setItem('active-game-data', {
      gameKey: '9as8d7',
      guesses: [
        {
          letters: [
            { letter: 'P', status: 'correct' },
            { letter: 'I', status: 'wrong-location' },
            { letter: 'L', status: 'incorrect' },
            { letter: 'O', status: 'incorrect' },
            { letter: 'T', status: 'incorrect' },
          ],
        },
      ],
    });

    let game = await this.service.fetchGame();

    assert.deepEqual(game, {
      gameKey: 'ba89d7g',
      guesses: [],
    });
  });

  test('guessing a non-existent word', async function (assert) {
    assert.expect(1);

    this.createGame('ba89d7g', 'ABBEY', ['CRAFT']);

    await this.service.fetchGame();

    try {
      await this.service.makeGuess('NTWRD');
    } catch (e) {
      assert.equal(
        e.reason,
        'INVALID_INPUT',
        'an error was thrown for a non-existent word'
      );
    }
  });
});

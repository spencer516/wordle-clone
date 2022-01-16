import Pretender from 'pretender';

class APIError extends Error {
  constructor({ status, error, reason }) {
    super(error);
    this.error = error;
    this.status = status;
    this.reason = reason;
  }
}

class Game {
  constructor(gameKey, word, dictionary) {
    this.gameKey = gameKey;
    this.word = word;
    this.wordSet = new Set(word.split(''));
    this.dictionary = Array.isArray(dictionary) ? new Set(dictionary) : null;
  }

  guessWord(guess) {
    const letters = [];

    if (this.dictionary && !this.dictionary.has(guess)) {
      throw new APIError({
        status: 400,
        error:
          'The guessed word does not exist in the dictionary (https://dictionaryapi.dev).',
        reason: 'INVALID_INPUT',
      });
    }

    for (const [idx, letter] of guess.split('').entries()) {
      const status =
        letter === this.word.charAt(idx)
          ? 'correct'
          : this.wordSet.has(letter)
          ? 'wrong-location'
          : 'incorrect';

      letters.push({
        letter,
        status,
      });
    }

    return letters;
  }
}

function makeResponse(json, status = 200) {
  return [status, { 'Content-Type': 'application/json' }, JSON.stringify(json)];
}

function assertGameExists(currentGame) {
  if (!(currentGame instanceof Game)) {
    throw new Error(
      'There was no current game created. Please use `this.createGame(gameKey, word)` to create a new game.'
    );
  }
}

const gameForServer = new WeakMap();

export function startTestServer() {
  return new Pretender(function () {
    this.get('http://localhost:3000/api/get-current-game', () => {
      const currentGame = gameForServer.get(this);
      assertGameExists(currentGame);
      return makeResponse({ gameKey: currentGame.gameKey });
    });

    this.get(
      'http://localhost:3000/api/make-guess/:gameKey/:guess',
      (request) => {
        const currentGame = gameForServer.get(this);
        assertGameExists(currentGame);

        const word = request.params.guess;
        try {
          const letters = currentGame.guessWord(word);
          return makeResponse({
            word,
            letters,
          });
        } catch (e) {
          const { status, error, reason } = e;
          return makeResponse({ error, reason }, status);
        }
      }
    );
  });
}

export function updateCurrentGame(server, gameKey, word, dictionary) {
  const game = new Game(gameKey, word, dictionary);
  gameForServer.set(server, game);
}

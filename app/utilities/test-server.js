import Pretender from 'pretender';

class Game {
  constructor(gameKey, word) {
    this.gameKey = gameKey;
    this.word = word;
    this.wordMap = new Map();

    for (const [idx, char] of word.split('').entries()) {
      this.wordMap.set(char, idx);
    }
  }

  guessWord(guess) {
    const letters = [];

    for (const [idx, letter] of guess.split('').entries()) {
      const exists = this.wordMap.has(letter);

      const status = exists
        ? idx === this.wordMap.get(letter)
          ? 'correct'
          : 'wrong-location'
        : 'incorrect';

      letters.push({
        letter,
        status,
      });
    }

    return letters;
  }
}

function makeResponse(json) {
  return [200, { 'Content-Type': 'application/json' }, JSON.stringify(json)];
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
    this.get('/api/get-current-game', () => {
      const currentGame = gameForServer.get(this);
      assertGameExists(currentGame);
      return makeResponse({ gameKey: currentGame.gameKey });
    });

    this.get('/api/make-guess/:gameKey/:guess', (request) => {
      const currentGame = gameForServer.get(this);
      assertGameExists(currentGame);

      const word = request.params.guess;
      return makeResponse({
        word,
        letters: currentGame.guessWord(word),
      });
    });
  });
}

export function updateCurrentGame(server, gameKey, word) {
  const game = new Game(gameKey, word);
  gameForServer.set(server, game);
}

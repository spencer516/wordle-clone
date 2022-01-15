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

export default function setTestServer(hooks) {
  hooks.beforeEach(function () {
    let currentGame = null;

    this.createGame = (gameKey, word) =>
      (currentGame = new Game(gameKey, word));

    this.testServer = new Pretender(function () {
      this.get('/api/get-current-game', () => {
        assertGameExists(currentGame);
        return makeResponse({ gameKey: currentGame.gameKey });
      });

      this.get('/api/make-guess/:guess', (request) => {
        assertGameExists(currentGame);

        const word = request.params.guess;
        return makeResponse({
          word,
          letters: currentGame.guessWord(word),
        });
      });
    });
  });
}

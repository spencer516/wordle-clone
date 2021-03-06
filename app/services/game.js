import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from 'wordle-clone/config/environment';

const API_BASE_URL =
  ENV.environment === 'production'
    ? 'https://wordle-clone-api.vercel.app'
    : 'http://localhost:3000';

const localStorageKey = 'active-game-data';

class GameError extends Error {
  constructor({ error, reason }) {
    super(error);
    this.error = error;
    this.reason = reason;
  }
}

export default class GameService extends Service {
  @service localStorage;
  @tracked currentGame = this.localStorage.getItem(localStorageKey);

  #updateGame(game = this.currentGame) {
    this.currentGame = game;
    this.localStorage.setItem(localStorageKey, game);
  }

  resetGame(gameKey = this.currentGame?.gameKey) {
    const game = {
      gameKey,
      guesses: [],
    };

    this.#updateGame(game);

    return game;
  }

  async fetchGame() {
    const request = await fetch(`${API_BASE_URL}/api/get-current-game`);
    const { gameKey } = await request.json();

    // The local game is the current game!
    if (gameKey === this.currentGame?.gameKey) {
      return this.currentGame;
    }

    return this.resetGame(gameKey);
  }

  async makeGuess(guess) {
    const gameKey = this.currentGame.gameKey;
    const request = await fetch(
      `${API_BASE_URL}/api/make-guess/${gameKey}/${guess}`
    );
    const json = await request.json();

    if (request.status !== 200) {
      throw new GameError(json);
    }

    const { letters } = json;

    this.currentGame.guesses.push({ letters });
    this.#updateGame();

    return this.currentGame;
  }
}

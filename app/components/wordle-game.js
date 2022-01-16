import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { task, dropTask, timeout } from 'ember-concurrency';
import range from '../utilities/range';
import ENV from 'wordle-clone/config/environment';

const TOAST_DELAY = ENV.environment === 'test' ? 1 : 2000;

export default class WordleGameComponent extends Component {
  @service game;
  @tracked activeGuess = '';
  @tracked gameState;
  @tracked guessHasError = false;
  @tracked userWonGame = false;

  constructor() {
    super(...arguments);
    this.loadGame.perform();
  }

  @task
  *loadGame() {
    this.gameState = yield this.game.fetchGame();
  }

  @dropTask
  *guessWord(word) {
    try {
      this.gameState = yield this.game.makeGuess(word);
      this.activeGuess = '';

      if (this.gameIsSolved) {
        this.userWonGame = true;
        yield timeout(TOAST_DELAY);
        this.userWonGame = false;
      }
    } catch (e) {
      // Render an error for 3 seconds...
      this.guessHasError = true;
      yield timeout(TOAST_DELAY);
      this.guessHasError = false;
    }
  }

  get activeGuessLetters() {
    const letters = [];

    for (const idx of range(0, 5)) {
      const letter = this.activeGuess.charAt(idx);
      letters.push({ letter, status: 'pending' });
    }

    return { letters };
  }

  get allGuesses() {
    const existingGuesses = this.gameState?.guesses ?? [];
    const guesses = [...existingGuesses];

    guesses.push(this.activeGuessLetters);

    for (let i = guesses.length; i < 6; i++) {
      const letters = [];

      for (let n = 0; n < 5; n++) {
        letters.push({ letter: '', status: 'pending' });
      }

      guesses.push({ letters });
    }

    return guesses;
  }

  get lastGuess() {
    const existingGuesses = this.gameState?.guesses ?? [];
    return existingGuesses[existingGuesses.length - 1];
  }

  get gameIsSolved() {
    const { lastGuess } = this;
    return (
      lastGuess &&
      lastGuess.letters.every((letter) => letter.status === 'correct')
    );
  }

  get gameIsComplete() {
    return this.gameIsSolved || this.gameState?.guesses.length === 6;
  }

  get playSuspended() {
    return this.gameIsComplete || this.guessWord.isRunning;
  }

  get letterStatus() {
    const letterMap = {};
    const existingGuesses = this.gameState?.guesses ?? [];

    for (const guess of existingGuesses) {
      for (const { status, letter } of guess.letters) {
        const mapStatus = letterMap[letter];

        if (!mapStatus) {
          letterMap[letter] = status;
        } else if (mapStatus === 'wrong-location' && status === 'correct') {
          letterMap[letter] = status;
        }
      }
    }

    return letterMap;
  }

  @action
  reset() {
    this.gameState = this.game.resetGame();
    this.activeGuess = '';
  }

  @action
  onCharacter(char) {
    if (this.playSuspended) return;
    this.activeGuess = `${this.activeGuess}${char.toUpperCase()}`.slice(0, 5);
  }

  @action
  onDelete() {
    if (this.playSuspended) return;
    this.activeGuess = this.activeGuess.slice(0, this.activeGuess.length - 1);
  }

  @action
  onEnter() {
    if (this.playSuspended) return;
    // Catching as errors are handled internally by the task
    this.guessWord.perform(this.activeGuess).catch(() => {});
  }
}

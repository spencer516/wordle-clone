import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { task, dropTask } from 'ember-concurrency';
import range from '../utilities/range';

export default class WordleGameComponent extends Component {
  @service gameService;
  @tracked activeGuess = '';
  @tracked game;

  constructor() {
    super(...arguments);
    this.loadGame.perform();
  }

  @task
  *loadGame() {
    this.game = yield this.gameService.fetchGame();
  }

  @dropTask
  *guessWord(word) {
    this.game = yield this.gameService.makeGuess(word);
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
    const existingGuesses = this.game?.guesses ?? [];
    const guesses = [...existingGuesses];

    guesses.push(this.activeGuessLetters);

    for (const _ of range(guesses.length, 6)) {
      const letters = [];

      for (const _ of range(0, 5)) {
        letters.push({ letter: '', status: 'pending' });
      }

      guesses.push({ letters });
    }

    return guesses;
  }

  get gameIsComplete() {
    const existingGuesses = this.game?.guesses ?? [];

    if (existingGuesses.length === 6) return true;

    const lastGuess = existingGuesses[existingGuesses.length - 1];

    if (lastGuess) {
      return lastGuess.letters.every((letter) => letter.status === 'correct');
    }

    return false;
  }

  get playSuspended() {
    return this.gameIsComplete || this.guessWord.isRunning;
  }

  get letterStatus() {
    const letterMap = {};
    const existingGuesses = this.game?.guesses ?? [];

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
    this.game = this.gameService.resetGame();
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
    this.guessWord.perform(this.activeGuess);
    this.activeGuess = '';
  }
}

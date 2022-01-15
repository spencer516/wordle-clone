import {
  startTestServer,
  updateCurrentGame,
} from 'wordle-clone/utilities/test-server';

export default function setupTestServer(hooks) {
  hooks.beforeEach(function () {
    this.testServer = startTestServer();

    this.createGame = (gameKey, word) =>
      updateCurrentGame(this.testServer, gameKey, word);
  });
}

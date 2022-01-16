import { startTestServer, updateCurrentGame } from './test-server';

export default function setupTestServer(hooks) {
  hooks.beforeEach(function () {
    this.testServer = startTestServer();

    this.createGame = (gameKey, word, dictionary = null) =>
      updateCurrentGame(this.testServer, gameKey, word, dictionary);
  });

  hooks.afterEach(function () {
    this.testServer.shutdown();
  });
}

import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'wordle-clone/config/environment';
import { startTestServer, updateCurrentGame } from './utilities/test-server';
import ENV from 'wordle-clone/config/environment';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

if (ENV.environment === 'development') {
  updateCurrentGame(startTestServer(), 'ad0b9a8', 'PANIC');
}

loadInitializers(App, config.modulePrefix);

import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'wordle-clone/config/environment';
import { startTestServer, updateCurrentGame } from './utilities/test-server';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

updateCurrentGame(startTestServer(), 'ad0b9a8', 'PANIC');

loadInitializers(App, config.modulePrefix);

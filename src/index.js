#! /usr/bin/env node
const program = require('commander');
const Match = require('./game');

program
  .name('connect4')
  .version(require('../package.json').version);

program
  .command('start')
  .description('Start a Connect4 Game')
  .option('-j, --join-match <type>', 'match id to join')
  .option('-o, --online', 'create online match')
  .action((options) => {
    const { online, onlineMatchId } = options;

    if (online && onlineMatchId) {
      console.log('error: options \'--join-match && --online\' can\'t be mixed');
      return;
    }

    const match = new Match();
    if (onlineMatchId) {
      match.joinOnlineMatch(onlineMatchId);
    } else if (online) {
      match.initOnlineMatch();
    } else {
      match.initLocalMatch();
    }
  });

program.parse(process.argv);

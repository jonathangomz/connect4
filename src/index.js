#! /usr/bin/env node
const program = require('commander');
const Match = require('./game');

program.version(require('../package.json').version);
program
  .command('start')
  .description('Start a Connect4 Game')
  .action(() => {
    const match = new Match();
    match.initMatch();
  });

program.parse(process.argv);
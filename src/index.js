const program = require('commander');
const Match = require('./game');

program.version('0.1.0');
program
  .command('start')
  .description('Start a Connect4 Game')
  .action(() => {
    const match = new Match();
    match.initMatch();
  });

program.parse(process.argv);
const readline = require('readline');
const connect4 = require('./connect4');

class Match {
  game = new connect4();
  first_player = 1;
  second_player = 2;
  round;
  turn;
  rl;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  initMatch() {
    this.rl.question(' Do you wanna start a new game? [Y]/n', (ans) => {
      if (ans === 'N' || ans === 'n')
        this.rl.close();
      else {
        this.startGame();
      }
    });
  }

  clean() {
    const lines = process.stdout.getWindowSize()[1];
    for (let i = 0; i < lines; i++) {
      console.log('\r\n');
    }
  }

  startGame() {
    this.round = 0;
    this.turn = 0;
    this.clean();
    this.game.initBoard();
    this.turnPlayer();
  }

  turnPlayer() {
    console.log('');
    console.log('\x1b[33m', `>>>>>>> |· Round #${this.round} ·|· Turn #${this.turn} <<<<<<<`);
    if (this.turn % 2 === 0) {
      this.playerMove(this.first_player);
    } else {
      this.playerMove(this.second_player);
    }
  }

  playerMove(player) {
    this.game.printBoard();
    this.rl.question(`\x1b[0m Player [${this.game.config.getColorForPlayer(player)}] >> Which column? `, (ans) => {
      let isWinner;
      const isValid = this.game.makeMove(ans, player);
      if (isValid) {
        this.turn += 1;
        isWinner = this.game.isMovementWinner();
      } else {
        this.clean();
        console.log('\x1b[31m', 'Invalid movement!');
      }

      if (player === this.second_player) {
        this.round += 1;
      }

      if (isWinner) {
        console.log(this.winScreen(player));
        this.initMatch();
      }
      else {
        this.clean();
        this.turnPlayer();
      }
    });
  }

  winScreen(player) {
    const c = `${this.game.config.getColorForPlayer(player)}\x1b`;

    let _________color__________ = '';
    for(const i of [,,,,,,,,,]){
      _________color__________ += c;
    }
    _________color__________ += '    \x1b[32m'
    
    const screen = `
\x1b[32m
>>>>>>>>>>>>> ·|· WIN ·|· <<<<<<<<<<<<<
|||||||||||||||||||||||||||||||||||||||
||                                   ||
||    ${_________color__________}    ||
||    ${_________color__________}    ||
||    ${_________color__________}    ||
||                                   ||
|||||||||||||||||||||||||||||||||||||||
\x1b[0m`;

  return screen;
  }
}

module.exports = Match;
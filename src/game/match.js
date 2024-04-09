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

  /**
   * Initialize a new match
   */
  initMatch() {
    this.rl.question(' Do you wanna start a new game? [Y]/n', (ans) => {
      if (ans.toLowerCase() === 'n')
        this.rl.close();
      else {
        this.startGame();
      }
    });
  }

  /**
   * Clean the console
   */
  clean() {
    const lines = process.stdout.getWindowSize()[1];
    for (let i = 0; i < lines; i++) {
      console.log('\r\n');
    }
  }
  
  /**
   * Set the global values to their default values
   */
  startGame() {
    this.round = 0;
    this.turn = 0;
    this.clean();
    this.game.initBoard();
    this.turnPlayer();
  }

  /**
   * Select the next player to move
   */
  turnPlayer() {
    console.log('');
    console.log('\x1b[33m', `>>>>>>> |· Round #${this.round} ·|· Turn #${this.turn} <<<<<<<`);
    if (this.turn % 2 === 0) {
      this.playerMove(this.first_player);
    } else {
      this.playerMove(this.second_player);
    }
  }

  /**
   * Read the player move.
   * 
   * Check if is a valid move and then check if is a winner move. If is an invalid move wait for another input and if is a winner move ask for a new match.
   * @param {number} player The current player
   */
  playerMove(player) {
    this.game.printBoard();
    this.rl.question(`\x1b[0m Player [${this.game.config.getColorForPlayer(player)}] >> Which column? `, (ans) => {
      let isWinner;
      const isValid = this.game.makeMove(ans, player);
      if (isValid) {
        this.turn += 1;
        this.clean();
        isWinner = this.game.isMovementWinner();
      } else {
        this.clean();
        console.log('\x1b[31m', 'Invalid movement!');
      }

      if (player === this.second_player)
        this.round += 1;

      if (isWinner) {
        console.log(`\x1b[32m The player ${this.game.config.getColorForPlayer(player)}\x1b[32m is the winner!\x1b[0m`);
        this.initMatch();
      }
      else
        this.turnPlayer();
    });
  }
}

module.exports = Match;
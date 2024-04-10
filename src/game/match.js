const readline = require('readline');
const connect4 = require('./connect4');

const OnlineMatch = require('./online');

class Match {
  game = new connect4();
  online;
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
      // TODO: Do something with the remote player
        this.rl.close();
      else {
        // Generate random uuid
        const matchId = 'privateId';
        this.startConnection(matchId);
        // this.startGame();
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
   * Start a connection for an online match
   */
  async startConnection(matchId) {
    if(!this.online) {
      this.online = new OnlineMatch(matchId);
    }

    if(this.online.socket.connected) {
      // If already is connected start a new match with the same remote player
      this.startGameOnline();
    } else {
      console.log('Waiting to connect...');
      this.online.socket.on("connect", async() => {
        this.online.localPlayerId = this.online.socket.id;
        console.log(`Connected as ${this.online.socket.id}`);

        const players = await this.online.connectToGame();
        if(!players) {
          console.log('Can not connect to game :c')
          return;
        } else {
          this.first_player = players.first;
          this.second_player = players.second;
        }

        // If there is not second player wait for a second player to connect
        if(!this.second_player) {
          console.log('Waiting for second player...');

          // Listen for second player
          let waiting = true;
          this.online.socket.on(`${this.online.matchId}_players`, (players) => {
            if(waiting && players.second) {
              // The listener for a second player is unnecessary after second player connection
              this.online.socket.removeAllListeners(`${this.online.matchId}_players`);

              waiting = false;
              this.second_player = players.second;

              // Start match
              this.startGameOnline();
            }
          });
        } else {
          // Start match
          this.startGameOnline();
        }
      });
    }
  }

  /**
   * Set the global values to their default values and start the online match
   */
  async startGameOnline() {
    this.round = 0;
    this.turn = 0;
    this.clean();
    this.game.initBoard();
    this.turnPlayerOnline();
  }

  /**
   * Select the next player to move or wait for the remote player move
   */
  turnPlayerOnline() {
    const currentPlayer = this.turn % 2 === 0 ? this.first_player : this.second_player;
    const currentPlayerToken = this.turn % 2 === 0 ? 1 : 2;

    console.log('');
    console.log('\x1b[33m', `>>>>>>> |· Round #${this.round} ·|· Turn #${this.turn} ·|· Online ·|· Current player [${currentPlayer}] <<<<<<<`);

    this.game.printBoard();

    if (currentPlayer === this.online.localPlayerId) {
      this.rl.question(`\x1b[0m Player [${this.game.config.getColorForPlayer(currentPlayerToken)}] >> Which column? `, async (playerInput) => {
        await this.playerMove(playerInput, currentPlayer);
      });
    } else {
      console.log('\x1b[33m', `>>>>>>> Waiting the remote player <<<<<<<`);
      this.online.socket.on(this.online.matchId, async (move) => {
        await this.playerMove(move.column, move.player);
      });
    }
  }

  /**
   * Select the next player to move
   */
  turnPlayer() {
    console.log('');
    console.log('\x1b[33m', `>>>>>>> |· Round #${this.round} ·|· Turn #${this.turn} <<<<<<<`);

    this.game.printBoard();

    const currentPlayer = this.turn % 2 === 0 ? this.first_player : this.second_player;
    this.rl.question(`\x1b[0m Player [${this.game.config.getColorForPlayer(currentPlayer)}] >> Which column? `, async (playerInput) => {
      await this.playerMove(playerInput, currentPlayer);
    });
  }

  /**
   * Read the player move.
   * 
   * Check if is a valid move and then check if is a winner move. If is an invalid move wait for another input and if is a winner move ask for a new match.
   * @param {number} player The current player
   */
  async playerMove(column, player) {
    let isWinner; 
    const isValid = this.game.makeMove(column, player);
    if (isValid) {
      if(player === this.online.localPlayerId) {
        // If is local player send the movement to the remote player
        await this.online.sendMove(column);
      } else {
        // If is the remove player remove the listener to avoid redundancy
        this.online.socket.removeAllListeners(this.online.matchId);
      }

      // Change the turn
      this.turn += 1;

      // If it is the move of the second player then increment the round
      if (player === this.second_player) {
        this.round += 1;
      }

      this.clean();

      // Check if is a winner move
      isWinner = this.game.isMovementWinner();
    } else {
      this.clean();
      console.log('\x1b[31m', 'Invalid movement!');
    }

    if (isWinner) {
      console.log(`\x1b[32m The player ${this.game.config.getColorForPlayer(player)}\x1b[32m is the winner!\x1b[0m`);
      this.initMatch();
    }
    else {
      if(this.online) {
        this.turnPlayerOnline();
      } else {
        this.turnPlayer();
      }
    }
  }
}

module.exports = Match;
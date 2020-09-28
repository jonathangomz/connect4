const Config = require('./config');
const winnerValidator = require('./winner');

class Connect4 {
  board;
  config;

  constructor(config = new Config()) {
    if(isNaN(config.rows) || isNaN(config.cols)) {
      throw 'Rows and columns must be a number';
    }

    this.config = config;
  }

  initBoard() {
    console.log('\x1b[37m', '----------------New game----------------');

    let new_board = [];
    for (let row = 0; row < this.config.rows; row++) {
      let new_row = [];
      for (let column = 0; column < this.config.cols; column++) {
        console.log(this.config.tokenForEmptyCell);
        new_row.push(this.config.tokenForEmptyCell);
      }
      new_board.push(new_row);
    }

    this.board = [];
    this.board.push(...new_board);
  }

  makeMove(column, player, print = false) {
    if(player < 1 || 3 < player) throw 'Only can be player 1 or 2';
    if(!this.isValidColumn(column)) return;
    
    let selected_row;
    for (let row = 0; row < this.board.length; row++) {
      if (this.board[row][column] !== this.config.tokenForEmptyCell) {
        if(!this.isValidRow(row - 1)) {
          console.log('The column is full!');
          return;
        }
        else {
          selected_row = row - 1;
          this.board[selected_row][column] = this.config.getTokenForPlayer(player);
        }
      }else if(row === this.board.length-1) {
        selected_row = row;
        this.board[selected_row][column] = this.config.getTokenForPlayer(player);
      }
    }
    
    if(print) this.printBoard();

    if(selected_row && this.isMovementWinner(selected_row, column)) {
      console.log(`\x1b[32m The player ${player} is the winner!`);
      return true;
    }
  }

  isValidColumn(column) {
    return (!isNaN(column) && (0 <= column && column < this.board[0].length));
  }

  isValidRow(row) {
    return (!isNaN(row) && (0 <= row && row < this.board.length));
  }

  printBoard() {
    let separator = '';
    let indexes = '';
    let count = -1;
    for (const _ of this.board[0]) {
      separator +=     `-----`;
      indexes += `|-${++count}-|`;
    }

    console.log('\x1b[36m', separator);
    console.log('\x1b[36m', indexes);
    console.log('\x1b[36m', separator);

    for (const row of this.board) {
      let formatted_row = "";
      for (const column of row) {
        formatted_row += `| \x1b[34m${column}\x1b[36m |`;
      }
      console.log('\x1b[36m', formatted_row);
    }
  }

  isMovementWinner(row, col) {
    const win = winnerValidator.winnerMovement({
      board: this.board,
      lastRow: row,
      lastCol: col,
      tokenForEmpty: this.config.tokenForEmptyCell,
      consecutiveToWin: 4
    });

    return win;
  }
}

module.exports = Connect4;
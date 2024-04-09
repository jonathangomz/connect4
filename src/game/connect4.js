const Config = require('./config');
const winnerValidator = require('./winner');

class Connect4 {
  board;
  lastRow;
  lastCol;
  config;

  constructor(config = new Config()) {
    if(isNaN(config.rows) || isNaN(config.cols)) {
      throw 'Rows and columns must be a number';
    }

    this.config = config;
  }

  /**
   * Load a new clean board
   */
  initBoard() {
    console.log('\x1b[37m', '---------------New game----------------');

    let new_board = [];
    for (let row = 0; row < this.config.rows; row++) {
      let new_row = [];
      for (let column = 0; column < this.config.cols; column++) {
        new_row.push(this.config.tokenForEmptyCell);
      }
      new_board.push(new_row);
    }

    this.board = [];
    this.board.push(...new_board);
  }

  makeMove(column, player, params = { print: false, validate: false }) {
    if(player < 1 || 3 < player) throw 'Only can be player 1 or 2';
    
    let isValidMovement = true;
    if(!this.isValidColumn(column)) return isValidMovement = false;

    for (let row = 0; row < this.board.length; row++) {
      if (this.board[row][column] !== this.config.tokenForEmptyCell) {
        if(!this.isValidRow(row - 1)) {
          console.log('\x1b[31m The column is full!');
          isValidMovement = false;
          break;
        }
        else {
          this.lastRow = row - 1;
          this.lastCol = column;
          this.board[this.lastRow][this.lastCol] = player;
          break;
        }
      }else if(row === this.board.length-1) {
        this.lastRow = row;
        this.lastCol = column;
        this.board[this.lastRow][this.lastCol] = player;
      }
    }
    
    if(params.print) this.printBoard();

    if(params.validate) return [isValidMovement, this.isMovementWinner()];

    return isValidMovement;
  }

  isValidColumn(column) {
    return (!isNaN(column) && (0 <= column && column < this.board[0].length));
  }

  isValidRow(row) {
    return (!isNaN(row) && (0 <= row && row < this.board.length));
  }

  printBoard() {
    let separator = '----';
    let indexes = '';
    let count = -1;
    for (const _ of this.board[0]) {
      separator +=     `-----`;
      indexes += `|·${++count}·|`;
    }
    indexes += '·/·|';
    console.log('\x1b[36m', separator);
    console.log('\x1b[36m', indexes);
    console.log('\x1b[36m', separator);

    let lastIndex = 0;
    for (const row of this.board) {
      let formatted_row = '';
      for (const column of row) {
        formatted_row += `|\x1b[34m${this.config.getColorForPlayer(column)}\x1b[36m|`;
      }
      formatted_row += `\x1b[36m·${lastIndex}·|`;
      lastIndex += 1;
      console.log('\x1b[36m', formatted_row);
    }
  }

  isMovementWinner(row = this.lastRow, col = this.lastCol) {
    let isWinner = false;
    if(row && col) {
      isWinner = winnerValidator.winnerMovement({
        board: this.board,
        lastRow: row,
        lastCol: col,
        tokenForEmpty: this.config.tokenForEmptyCell,
        consecutiveToWin: 4
      });
    }

    return isWinner;
  }
}

module.exports = Connect4;
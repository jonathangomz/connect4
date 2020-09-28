class WinnerValidator {
  board;
  lastRow;
  lastCol;
  tokenForEmpty;
  consecutiveToWin;

  static winnerMovement({ board, lastRow, lastCol, tokenForEmpty, consecutiveToWin }) {
    this.board = board;
    this.lastRow = lastRow;
    this.lastCol = lastCol;
    this.tokenForEmpty = tokenForEmpty;
    this.consecutiveToWin = consecutiveToWin;

    return (this.winnerOnRow() || this.winnerOnColumn());
  }

  static winnerOnRow() {
    const current_row = this.board[this.lastRow];
    return this.haveWinnerConsecutives(current_row);
  }

  static winnerOnColumn() {
    const current_col = this.generateArrayFromCurrentColumn();
    return this.haveWinnerConsecutives(current_col);
  }

  static haveWinnerConsecutives(arr) {
    if(!Array.isArray(arr)) throw 'Not an array';
    
    let consecutive_equals = 1;
    let current_token;
    for(const item of arr) {
      if(item === this.tokenForEmpty) {
        continue;
      }
      if(item === current_token) {
        consecutive_equals += 1;
        
      }
      else {
        current_token = item;
        consecutive_equals = 1;
      }
      
      if(consecutive_equals === this.consecutiveToWin) {
        return true;
      }
    }
    return false;
  }

  static generateArrayFromCurrentColumn() {
    let column_array = new Array();
    for (let row = 0; row < this.board.length; row++) {
      column_array.push(this.board[row][this.lastCol]);
    }
    return column_array;
  }
}

module.exports = WinnerValidator;
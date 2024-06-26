class WinnerValidator {
  board;
  lastRow;
  lastCol;
  tokenForEmpty;
  consecutiveToWin;

  static winnerMovement({ board, lastRow, lastCol, tokenForEmpty, consecutiveToWin }) {
    this.board = board;
    this.currentRow = Number.parseInt(lastRow);
    this.currentColumn = Number.parseInt(lastCol);
    this.tokenForEmpty = tokenForEmpty;
    this.consecutiveToWin = consecutiveToWin;

    return (this.winnerOnRow || this.winnerOnColumn || this.winnerOnDiagonal || this.winnerOnInvertedDiagonal);
  }

  static get winnerOnRow() {
    const current_row = this.board[this.currentRow];
    return this.haveWinnerConsecutives(current_row);
  }

  static get winnerOnColumn() {
    const current_col = this.generateArrayFromCurrentColumn();
    return this.haveWinnerConsecutives(current_col);
  }

  static get winnerOnDiagonal() {
    const currentDiagonal = this.generateArrayFromDiagonal();
    return this.haveWinnerConsecutives(currentDiagonal);
  }

  static get winnerOnInvertedDiagonal() {
    const currentInvertedDiagonal = this.generateArrayFromInvertedDiagonal();
    return this.haveWinnerConsecutives(currentInvertedDiagonal);
  }

  static haveWinnerConsecutives(arr) {
    if(!Array.isArray(arr)) throw 'Not an array';
    
    let consecutiveTokens = 0;
    let currentToken;
    for(const token of arr) {
      if(token === this.tokenForEmpty) {
        // If is empty token reset count
        consecutiveTokens = 0;
        continue;
      } else {
        if(token === currentToken) {
          consecutiveTokens += 1;
          // Check if have enough consecutives tokens
          if(consecutiveTokens === this.consecutiveToWin) {
            return true;
          }
        } else {
          // If is a different token start counting
          consecutiveTokens = 1;
          currentToken = token;
        }
      }
    }
    return false;
  }

  static generateArrayFromCurrentColumn() {
    let column_array = new Array();
    for (let row = 0; row < this.board.length; row++) {
      column_array.push(this.board[row][this.currentColumn]);
    }
    return column_array;
  }

  static generateArrayFromDiagonal() {
    let diagonalArray = new Array();

    let initialRow = this.currentRow;
    let initialCol = this.currentColumn;

    if(this.currentRow === 0 || this.currentColumn === this.board[this.currentRow].length) {
      // If is first row or last column then just invert the values
      initialRow = this.currentColumn;
      initialCol = this.currentRow;
    } else if (this.currentColumn === 0 || this.currentRow === (this.board.length - 1)) {
      // If is last row or first column then already are the initial values
      initialRow = this.currentRow;
      initialCol = this.currentColumn;
    } else {
      // Distance between the first column to the current column
      let distanceColumn = this.currentColumn;

      // Distance between the current row to the last row in the board
      let distanceRow = (this.board.length - 1) - this.currentRow;

      // Get the shortest distance
      // If is equal then it doesn't matter
      let shortestDistance = distanceRow >= distanceColumn ? distanceColumn : distanceRow;

      // Use the shortest distance to calculate the initial row and column for the diagonal
      initialRow = this.currentRow + shortestDistance;
      initialCol = this.currentColumn - shortestDistance;
    }

    // Get the array from the diagonal
    for (let row = initialRow, col = initialCol; (row >= 0 && col < this.board[this.currentRow].length); row--, col++) {
      diagonalArray.push(this.board[row][col]);
    }

    return diagonalArray;
  }

  static generateArrayFromInvertedDiagonal() {
    let invertedDiagonalArray = new Array();

    let initialRow = this.currentRow;
    let initialCol = this.currentColumn;

    if (this.currentColumn === 0 || this.currentRow === 0) {
      // If is last row or last column then already are the initial values
      initialRow = this.currentRow;
      initialCol = this.currentColumn;
    } else {
      // Distance between the first column to the current column
      let distanceColumn = this.currentColumn;

      // Distance between the first row to the current row
      let distanceRow = this.currentRow;

      // Get the shortest distance
      // If is equal then it doesn't matter
      let shortestDistance = distanceRow >= distanceColumn ? distanceColumn : distanceRow;

      // Use the shortest distance to calculate the initial row and column for the diagonal
      initialRow = this.currentRow - shortestDistance;
      initialCol = this.currentColumn - shortestDistance;
    }

    // Get the array from the diagonal
    for (let row = initialRow, col = initialCol; (row < this.board.length && col < this.board[this.currentRow].length); row++, col++) {
      invertedDiagonalArray.push(this.board[row][col]);
    }

    return invertedDiagonalArray;
  }
}

module.exports = WinnerValidator;
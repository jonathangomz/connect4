class Connect4Config {
  rows = 6;
  cols = 7;
  roundsLimit;
  tokenForEmptyCell = ' ';
  tokenForFirstPlayer = 'O';
  tokenForSecondPlayer = 'X';

  getTokenForPlayer(player) {
    if (player === 1) return this.tokenForFirstPlayer;
    else return this.tokenForSecondPlayer;
  }
}

module.exports = Connect4Config;
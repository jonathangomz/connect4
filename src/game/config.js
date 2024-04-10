class Connect4Config {
  rows = 6;
  cols = 7;
  roundsLimit;
  tokenForEmptyCell = '   ';
  firstPlayerToken = 1;
  secondPlayerToken = 2;
  colorForFirstPlayer = '\x1b[44m   \x1b[0m';
  colorForSecondPlayer = '\x1b[45m   \x1b[0m';

  getColorForPlayer(player) {
    if (player === 1) return this.colorForFirstPlayer;
    else if(player === 2) return this.colorForSecondPlayer;
    else return this.tokenForEmptyCell;
  }
}

module.exports = Connect4Config;
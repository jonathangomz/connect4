class OnlineMatch {
  socket;
  matchId;
  localPlayer;
  localPlayerId;

  constructor(matchId) {
    const io = require('socket.io-client');
    this.socket = io('http://localhost:3000/');

    // client-side
    this.socket.on("connect", () => {
      this.localPlayerId = this.socket.id;
    });

    this.matchId = matchId;
  }
  
  async sendMove(column) {
    await fetch(`http://localhost:3000/${this.matchId}/move`, {
      method: 'POST',
      body: JSON.stringify({ player: this.localPlayerId, column }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async connectToGame() {
    const response = await fetch(`http://localhost:3000/${this.matchId}`, {
      method: 'POST',
      body: JSON.stringify({ player: this.localPlayerId }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const game = await response.json();

    if(game.players.first === this.localPlayerId || game.players.second === this.localPlayerId) {
      return game.players;
    } else {
      return;
    }
  }
}

module.exports = OnlineMatch;
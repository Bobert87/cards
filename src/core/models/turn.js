var guid = require('node-uuid');
class Turn{
    constructor (gameId,currentPlayer)
    {
        this.gameId = gameId;
        this.id = guid.v4();
        this.player = currentPlayer;
        this.status  = 'ready';
        this.power = 0;
        this.cardsPlayed = [];
        this.cardsDistroyed = [];
        this.lastTurn = {};
    }
    toString(){
        return JSON.stringify(this);
    }

    playCard(cardIndex){

    }
}
module.exports = Turn;
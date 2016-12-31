//noinspection JSUnresolvedFunction
var guid = require('node-uuid');
const turnStatus = ['ready','playing','ended'];

class Turn{
    constructor (gameId,currentPlayer)
    {
        this.gameId = gameId;
        this.id = guid.v4();
        this.player = currentPlayer;
        this.status  = 'ready';
        this.power = 0;
        this.cardsPlayed = [];
        this.cardsPurchased = [];
        this.cardsDistroyed = [];
        this.lastTurn = {};
    }
    toString(){
        return JSON.stringify(this);
    }
}
module.exports = Turn;
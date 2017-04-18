/**
 * Created by boris on 12/26/2016.
 */


function addPower(game, args) {
    let power = args[0];
    game.turn.power += power;
    return power + ' power added to turn.';
}

function drawCard(game, args) {
    let cardsToDraw = args[0];
    if (game.turn.player.deck.length < cardsToDraw) {
        game.discardIntoDeck();
    }
    for (let i=0;i<cardsToDraw;i++) {
        game.turn.player.hand.push(game.turn.player.deck.pop())
    }
    return cardsToDraw + ' cards drawn.';
}

class Powers {
    constructor() {
        this.addPower = addPower;
        this.drawCard = drawCard;
    }
}

module.exports = Powers;
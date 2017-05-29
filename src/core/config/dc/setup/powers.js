/**
 * Created by boris on 12/26/2016.
 */

/**
 * 
 * @param {Object} game - The game object of the current match.
 * @param {Array} args - A one item index, the power to be added.
 */
function addPower(game, args) {
    let power = args[0];
    game.turn.power += power;
    return power + ' power added to turn.';
}

/**
 * 
 * @param {Object} game - The game object of the current match.
 * @param {Array} args - A one item index, the number of cards to be drawn from the player's deck.
 */
function drawCard(game, args) {
    let cardsToDraw = args[0];    
    for (let i=0;i<cardsToDraw;i++) {
        if (game.turn.player.deck.length > 0){
            game.turn.player.hand.push(game.turn.player.deck.pop())
        }
        else{
            game.discardIntoDeck();
        }
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
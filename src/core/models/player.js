'use strict'
var guid = require('node-uuid');

/**
 * This calss will hold all the player's information.
 */
class Player {
    constructor(email, nickname, order, character, hand = [], deck = []) {
        this.id = guid.v4();
        this.email = email;
        this.nickname = nickname;
        this.order = order;
        this.character = character;
        this.hand = hand;
        this.deck = deck;
        this.discardPile = [];
    }

    toString() {
        return JSON.stringify(this);
    }
}
module.exports = Player;

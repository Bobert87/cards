'use strict'
var Player = require('./player.js');
var shuffle = require('shuffle-array');
var clone = require('clone');
/*Utils*/
var guid = require('node-uuid');

const nl = (process.platform === 'win32' ? '\r\n' : '\n');

const initPlayers = function (number, allCards) {
    //First Hand
    let mainDeck = [];
    let firstHand = this.setup.initialPlayerDeck;
    for (let st in firstHand) {
        for (let card in allCards) {
            for (let k = 0; k < firstHand[st]; k++) {
                if (allCards[card].name === st) {
                    console.log(allCards[card]);
                    mainDeck.push(allCards[card]);
                }
            }
        }
    }

    //Initialize Players
    let players = [];
    let playersOrder = [];
    for (let i = 0; i < number; i++) {
        playersOrder.push(i);
    }
    shuffle(playersOrder);


    let characters = this.setup.characters;
    shuffle(characters);
    for (let i = 0; i < number; i++) {
        let p = new Player('', 'Player-' + i, playersOrder[i] + 1, require('../cards/' + characters.shift().file));
        shuffle(mainDeck);
        p.deck = clone(mainDeck);
        for (let j = 0; j < this.setup.handSize; j++) {
            p.hand.push(p.deck.pop());
        }
        players.push(p);
    }
    return players;
};
const playCard = function (cardIndex) {
    let powerLog = '';
    let card = this.turn.player.hand[cardIndex];
    for (let power in card.powers) {
        let powRow = card.powers[power];
        let result = this.setup.powers[powRow[0]](this, powRow.slice(1, powRow.length));
        powerLog = result + nl;
    }
    console.log(powerLog);
    this.turn.status = 'playing';
    this.turn.cardsPlayed.push(this.turn.player.hand.splice(cardIndex, 1));
};
const purchaseCard = function (cardIndex) {
    let card = this.lineUp.splice(cardIndex, 1)[0];
    this.turn.cardsPurchased.push(card);
    this.turn.power -= card.cost;
    return card;
};
const endTurn = function endTurn(handSize = 5) {
    this.setLineUp();
    this.setHand(handSize);
    this.purchaseToDiscard();
    this.turn = null;
};
const setLineUp = function () {
    while (this.lineUp.length < 5) {
        this.lineUp.push(this.mainDeck.pop());
    }
};
const setHand = function (handSize = 5) {
    while (this.turn.player.hand.length > 0) {
        this.turn.player.discardPile.push(this.turn.player.hand.pop());
    }
    if (this.turn.player.deck.length >= handSize) {
        while (this.turn.player.hand.length < handSize) {
            this.turn.player.hand.push(this.turn.player.deck.pop());
        }
    }
    else {
        let cardCount = 0;
        while (this.turn.player.deck.length > 0) {
            this.turn.player.hand.push(this.turn.player.deck.pop());
            cardCount++;
        }
        this.discardIntoDeck();
        while(this.turn.player.hand.length < handSize){
            this.turn.player.hand.push(this.turn.player.deck.pop());
        }
    }
};
const purchaseToDiscard = function () {
    while (this.turn.cardsPurchased.length > 0) {
        this.turn.player.discardPile.push(this.turn.cardsPurchased.pop());
    }
}
const discardIntoDeck = function(){
    shuffle(this.turn.player.discardPile);
    while(this.turn.player.discardPile.length > 0){
        this.turn.player.deck.push(this.turn.player.discardPile.pop());
    }
}

class Game {
    toString() {
        return JSON.stringify(this);
    }

    constructor(setup, numberOfPlayers, allCards, mainDeck, lineUp, destoryed) {
        //Methods
        this.initPlayers = initPlayers;
        this.playCard = playCard;
        this.purchaseCard = purchaseCard;
        this.setLineUp = setLineUp;
        this.setHand = setHand;
        this.endTurn = endTurn;
        this.purchaseToDiscard = purchaseToDiscard;
        this.discardIntoDeck = discardIntoDeck;

        //Create an Id for this as a unique game
        this.id = guid.v1();
        this.setup = clone(setup);
        this.players = this.initPlayers(numberOfPlayers, allCards);
        //Initialize main deck.
        this.mainDeck = clone(mainDeck);
        this.allCards = clone(allCards);
        shuffle(mainDeck);
        this.lineUp = [];
        for (let i = 0; i < setup.lineupSize; i++) {
            this.lineUp.push(mainDeck.pop());
        }
        this.destroyed = [];
        this.turn = null;
    }
}

module.exports = Game;

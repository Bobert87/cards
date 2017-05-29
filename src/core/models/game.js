'use strict'
var Player = require('./player.js');
var shuffle = require('shuffle-array');
var clone = require('clone');
/*Utils*/
var guid = require('node-uuid');

const nl = (process.platform === 'win32' ? '\r\n' : '\n');

/**
 * Each player on each game will start with this deck
 */
const getFirstDeck = function () {
    //First Hand
    let mainDeck = [];
    let firstHand = this.setup.initialPlayerDeck;
    for (let st in firstHand) {
        for (let card in this.allCards) {
            for (let k = 0; k < firstHand[st]; k++) {
                if (this.allCards[card].name === st) {
                    mainDeck.push(this.allCards[card]);
                }
            }
        }
    }
    return mainDeck
}

/**
 * TODO: make this simpler!!
 * Initializes tha players, randomizes their turn order and shuffles their decks.
 * @param {int} number - Number of players is this match.
 */
const initPlayers = function (number) {
    
    let firsthand = this.getFirstDeck();
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
        let p = new Player('', 'Player-' + i, playersOrder[i] + 1, require('../config/'+this.setup.name+'/cards/' + characters.shift().file));        
        p.deck = clone(firsthand);
        shuffle(p.deck);
        for (let j = 0; j < this.setup.handSize; j++) {
            p.hand.push(p.deck.pop());
        }
        players.push(p);
    }
    return players;
};


/**
 * Will add the power of a card to the turn and will execute every power in the list.
 * @param {int} cardIndex - The index of the card within the hand.
 */
const playCard = function (cardIndex) {
    let powerLog = '';
    let card = this.turn.player.hand[cardIndex];
    if (card.facingDown)
        return;
    for (let power in card.powers) {
        let powRow = card.powers[power];
        let result = this.setup.powers[powRow[0]](this, powRow.slice(1, powRow.length));
        powerLog = result + nl;
    }
    this.turn.status = 'playing';
    this.turn.cardsPlayed.push(this.turn.player.hand.splice(cardIndex, 1)[0]);
};

/**
 * Will add the card to the list of cards purchased and remove it from the lineup.
 * @param {int} cardIndex - The index of the card to purchase within the lineup.
 */
const purchaseCard = function (cardIndex) {
    let card = this.lineUp.splice(cardIndex, 1)[0];
    this.turn.cardsPurchased.push(card);
    this.turn.power -= card.cost;
    return card;
};


const endTurn = function endTurn(handSize = 5) {
    this.setLineUp();
    this.handToDiscard();
    this.playedToDiscard();
    this.purchaseToDiscard();
    this.setHand(handSize);
    delete this.turn;
};


/**
 * Sets the lineup to the lineup size configured on the setup.
 */
const setLineUp = function () {
    while (this.lineUp.length < this.setup.lineupSize) {
        if (this.mainDeck.length == 0)
            return;
        this.lineUp.push(this.mainDeck.pop());
    }
};

/**
 * Returns a hand for the player to use.
 * @param {int} handSize - The number of cards to be assigned to the player hand
 */
const setHand = function (handSize = 5) {
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

/**
 * Moves all the cards played during this turn to the discard cards pile.
 */
const playedToDiscard = function () {
    while (this.turn.cardsPlayed.length > 0) {
        this.turn.player.discardPile.push(this.turn.cardsPlayed.pop());
    }
}

/**
 * Moves all the cards pruchased during this turn to the discard cards pile.
 */
const purchasedToDiscard = function () {
    while (this.turn.cardsPurchased.length > 0) {
        this.turn.player.discardPile.push(this.turn.cardsPurchased.pop());
    }
}
/**
 * Moves all cards from the hand to the discard pile.
 */
const handToDiscard = function () {
    while (this.turn.player.hand.length > 0) {
        this.turn.player.discardPile.push(this.turn.player.hand.pop());
    }
}

/**
 * Shuffles the discard pile and moves it into the player's deck.
 */
const discardIntoDeck = function(){
    shuffle(this.turn.player.discardPile);
    while(this.turn.player.discardPile.length > 0){
        this.turn.player.deck.push(this.turn.player.discardPile.pop());
    }
}

/**
 * This class will hold all the match information.
 */
class Game {
    toString() {
        return JSON.stringify(this);
    }

    constructor(setup, numberOfPlayers, allCards, mainDeck, lineUp, destoryed) {
        //Methods
        this.getFirstDeck = getFirstDeck;
        this.initPlayers = initPlayers;
        this.playCard = playCard;
        this.purchaseCard = purchaseCard;
        this.setLineUp = setLineUp;
        this.setHand = setHand;
        this.endTurn = endTurn;
        this.purchaseToDiscard = purchasedToDiscard;
        this.playedToDiscard = playedToDiscard;
        this.discardIntoDeck = discardIntoDeck;
        this.handToDiscard = handToDiscard;


        //Create an Id for this as a unique game
        this.id = guid.v1();
        this.setup = clone(setup);        
        //Initialize main deck.
        this.mainDeck = clone(mainDeck);
        this.allCards = clone(allCards);
        this.players = this.initPlayers(numberOfPlayers, allCards);
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

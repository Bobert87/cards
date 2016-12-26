var Player = require('./player.js');
var shuffle = require('shuffle-array');
var clone = require('clone');
/*Utils*/
var guid = require('node-uuid');

class Game {

    toString() {
        return JSON.stringify(this);
    }
    constructor(setup, numberOfPlayers, allCards, mainDeck, lineUp, destoryed) {
        //Create an Id for this as a unique game
        this.id = guid.v1();
        this.setup = clone(setup);
        this.players = this.initPlayers(this.setup, numberOfPlayers, allCards);
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

    initPlayers(setup, number, allCards) {
        //First Hand
        let mainDeck = [];
        let firstHand = setup.initialPlayerDeck;
        for (let st in firstHand) {
            for (let card in allCards) {
                for (let k = 0; k < firstHand[st]; k++) {
                    if (allCards[card].name === st) {
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


        let characters = setup.characters;
        shuffle(characters);
        for (let i = 0; i < number; i++) {
            let p = new Player('', 'Player-' + i, playersOrder[i] + 1,require('../cards/'+characters.shift().file));
            shuffle(mainDeck);
            p.mainDeck = mainDeck;
            for(let j=0;j<setup.handSize;j++)
            {
                p.hand.push(p.mainDeck.pop());
            }
            players.push(p);
        }
        return players;
    }
}

module.exports = Game;
'use strict'

/**
 * Loads all cards in the configuration Object
 * @param {string} deckConfig - Configuration Object
 */
let loadAllCards = function (deckConfig) {
    let allCards = [];
    for (let card in deckConfig.cards) {
        let c = require(`../config/${deckConfig.name}/cards/${deckConfig.cards[card].file}`);
        allCards.push(c)
    }
    return allCards;
};

/**
 * This will return the subset of all cards to be included in the main deck
 * @param {Object} deckConfig  - The card setup
 * @param {*} allCards  - All cards available for this setup.
 */
let loadMainDeck = function (deckConfig, allCards) {
    let mainDeck = [];
    for (let cardConfig in deckConfig.cards) {
        for (let card in allCards) {
            if (deckConfig.cards[cardConfig].name === allCards[card].name) {
                if ((deckConfig.outOfDeck.indexOf(allCards[card].cardType) < 0) && (deckConfig.outOfDeck.indexOf(allCards[card].name) < 0)) {
                    for (let i = 0; i < deckConfig.cards[card].count; i++) {
                        mainDeck.push(allCards[card]);
                    }
                }
            }
        }
    }
    return mainDeck;
};

module.exports.loadAllCards = loadAllCards;
module.exports.loadMainDeck = loadMainDeck;

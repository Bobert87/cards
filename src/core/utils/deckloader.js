let loadAllCards = function (deckConfig) {
    let allCards;
    allCards = [];
    for (let card in deckConfig.cards) {
        let c = require('../cards/' + deckConfig.cards[card].file);
        allCards.push(c)
    }
    return allCards;
}
let loadMainDeck = function (deckConfig,allCards) {
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
}

module.exports.loadAllCards = loadAllCards;
module.exports.loadMainDeck = loadMainDeck;

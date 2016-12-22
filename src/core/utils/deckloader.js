var AllCards = [];
var MainDeck = [];
var loadCards = function (deckConfig)
{
    for (var card in deckConfig)
    {
        console.log(deckConfig[card].file);
        AllCards.push(require('../cards/'+deckConfig[card].file))
        for (i=0; i< deckConfig[card].count;i++)
        {
            MainDeck.push(deckConfig[card]);
        }

    }
    console.log(JSON.stringify(MainDeck)+'---->');
    return MainDeck;
}

module.exports.loadCards = loadCards;

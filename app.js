/*Server*/
var express = require('express');
var app = express();
/*Server*/

/*Utils*/
const utils = require('./src/core/utils/utils.js');
/*Utils**/

/*Game Logic*/

const cardLoader = require('./src/core/utils/deckloader.js');
const player = require('./src/core/models/player.js');
const Game = require('./src/core/models/game.js');
const Turn = require('./src/core/models/turn.js');

let games = [];

function getGame(gameId) {
    let game = {};
    for (g in games) {
        if (games[g].id === gameId) {
            game = games[g];
            break;
        }
    }
    return game;
}

app.get('/game/new/:type/:numberOfPlayers',function(req,res){

    let setup = utils.getSetup(req.params.type);
    let numberOfPlayers = req.params.numberOfPlayers;
    let cardSet = cardLoader.loadAllCards(setup);
    let mainDeck = cardLoader.loadMainDeck(setup,cardSet);
    let game = new Game(setup,numberOfPlayers, cardSet, mainDeck, [], []);

    games.push(game);
    res.send(game.id+'<br>http://localhost:3001/game/'+game.id+'/turn/');
    return 200;
})

app.get('/server/clean',function(req,res){

    while(games.length > 0)
    {
        games.pop();
    }
    res.send(games);
    return 200;
});

app.get('/game/:gameId/turn/',function(req,res) {
    //Get the current game
    let gameId = req.params.gameId;
    let game =  getGame(gameId);
    if (!game.turn) {
        //Cycle through
        let player = game.players.shift();
        game.players.push(player);
        let turn = new Turn(gameId, player);
        game.turn = turn;
        res.send('<h1>Game has started!!!!!</h1><h2>'+turn.player.character.name+'</h2>'+JSON.stringify(turn.player.hand));
    }
    else {
        switch (game.turn.status) {
            case 'playing':
                res.send('<h1>Ongoing Turn!</h1><h2>'+turn.player.character.name+'</h2>'+JSON.stringify(turn.player.hand));
                break;
            case 'ended':
                let player = game.players.shift();
                game.players.push(player);
                let turn = new Turn(gameId, player);
                game.turn = turn;
                res.send('<h1>The turn for'+turn.player.character.name+'</h1>'+JSON.stringify(turn.player.hand));
                break;
            default: res.send('nothing has changed... <br>localhost:3001/game/'+gameId+'/turn/'+game.turn.id+'/card/0');
            console.log('localhost:3001/game/'+gameId+'/turn/'+game.turn.id+'/card/0')
        }
    }
    return 200;
});

app.get('/game/:gameId/turn/:turnId/card/:cardIndex',function(req,res) {
    let gameId = req.params.gameId;
    let turnId = req.params.turnId;
    let cardIndex = req.params.cardIndex;
    let game = getGame(gameId);
    if (turnId !== game.turn.id) {
        res.send('Unexpected turn identification' + turnId);
        return 400;
    }
    if (game.turn.player.hand.length == 0) {
        //res.send('No more cards to play in your hand!');
        res.send('http://localhost:3001/game/'+gameId+'/turn/'+turnId+'/lineup/0');
        return 400;
    }
    if (cardIndex > game.turn.player.hand.length - 1) {
        res.send('Index of card not in range');
        return 400;
    }

    res.send(game.playCard(cardIndex));
    return 200;
});

app.get('/game/:gameId/turn/:turnId/lineup/:cardIndex',function(req,res){
    let gameId = req.params.gameId;
    let turnId = req.params.turnId;
    let cardIndex = req.params.cardIndex;
    let game = getGame(gameId);
    if (turnId !== game.turn.id) {
        res.send('Unexpected turn identification: ' + turnId);
        return 400;
    }
    if (game.lineUp.length == 0) {
        res.send('No more cards to purchase in the lineup.');
        return 400;
    }
    if (cardIndex > game.lineUp.length - 1) {
        res.send('Index of card not in range.');
        return 400;
    }
    if (game.turn.power < game.lineUp[cardIndex].cost) {
        res.send('Not enough power to purchase selected card.');
        return 400;
    }
    game.purchaseCard(cardIndex);
    res.send(game.lineUp);
    console.log('Turn Power:'+ game.turn.power);
    console.log('LineUp Card Cpst:'+ game.lineUp[cardIndex].cost);
    console.log('-------------------------------------Purchased------------------------------------');
    console.log(game.turn.cardsPurchased);
});

app.get('/cards',function(req,res){
    res.send(games[0].players);
    return 200;
});


app.listen(utils.ENV.port, function() {
    //fasdfasd
    console.log('Server listening on port ' + utils.ENV.port);
});

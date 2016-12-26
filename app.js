/*Server*/
var express = require('express');
var app = express();
/*Server*/



const utils = require('./src/core/utils/utils.js');
/*Utils*/

/*Game Logic*/

const cardLoader = require('./src/core/utils/deckloader.js');
const player = require('./src/core/models/player.js');
const Game = require('./src/core/models/game.js');
const Turn = require('./src/core/models/turn.js');

let games = [];

app.get('/game/new/:type/:numberOfPlayers',function(req,res){

    let setup = utils.getSetup(req.params.type);
    let numberOfPlayers = req.params.numberOfPlayers;
    let cardSet = cardLoader.loadAllCards(setup);
    let mainDeck = cardLoader.loadMainDeck(setup,cardSet);
    let game = new Game(setup,numberOfPlayers, cardSet, mainDeck, [], []);

    games.push(game);
    res.send(game.id);
    return 200;
})

app.get('/server/clean',function(req,res){

    while(games.length > 0)
    {
        games.pop();
    }
    res.send(games);
    return 200;
})

app.get('game/:gameId/turn/',function(req,res) {
    //Get the current game
    let gameId = req.params.gameId;
    let game = {};
    for (g in games) {
        if (games[g].id === gameId) {
            game = games[g];
            break;
        }
    }
    let turn = {};
    if (!game.turn) {
        //Cycle through
        let player = game.players.shift();
        game.players.push(player);
        turn = new Turn(gameId, player);
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
                turn = new Turn(gameId, player);
                game.turn = turn;
                res.send('<h1>The turn for'+turn.player.character.name+'</h1>'+JSON.stringify(turn.player.hand));
                break;
            default: res.send('nothing has changed...');
        }

    }
    game.turn = turn;
    return 200;
});



app.get('/game/:gameId/turn/:turnId/card/:cardIndex',function(req,res){
    res.send(games[0].players);
    return 200;
});

app.get('/cards',function(req,res){
    res.send(games[0].players);
    return 200;
});


app.listen(utils.ENV.port, function() {
    //fasdfasd
    console.log('Server listening on port ' + utils.ENV.port);
});

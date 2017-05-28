'use strict'
/*Utils*/
const utils = require('./src/core/utils/utils.js');
/*Utils**/

/*Server*/
const express = require('express'),
      app     = express(),
      server = require('http').createServer(app),
      io = require('socket.io')(server);


app.set('port', utils.ENV.port || 3001);
app.set('view engine', 'pug');
app.use(express.static('public'));
/*Server*/

/*Game Logic*/
const cardLoader = require('./src/core/utils/deckloader.js'),
      player     = require('./src/core/models/player.js'),
      Game       = require('./src/core/models/game.js'),
      Turn       = require('./src/core/models/turn.js'),
      Prompt     = require('./src/core/models/prompt.js');

let games = [];

function getGame(gameId) {

    let game = {};

    for (let g in games) {
        if (games[g].id === gameId) {
            game = games[g];
            break;
        }
    }

    return game;
}

app.get('/game/new/:type/:numberOfPlayers', function (req, res) {

    let setup           = utils.getSetup(req.params.type),
        numberOfPlayers = req.params.numberOfPlayers,
        cardSet         = cardLoader.loadAllCards(setup),
        mainDeck        = cardLoader.loadMainDeck(setup, cardSet),
        game            = new Game(setup, numberOfPlayers, cardSet, mainDeck, [], []);

    games.push(game);
    res.send(`${game.id}<br><a href="http://localhost:3001/game/${game.id}/turn/start">http://localhost:3001/game/${game.id}/turn/start</a>`);

    return 200;
});

app.get('/server/clean', function (req, res) {

    if (games.length > 0)
        games = [];

    res.send(games);

    return 200;
});

app.get('/game/:gameId/turn/start', function (req, res) {

    let gameId = req.params.gameId,
        game   = getGame(gameId);

    if (!game.turn) {
        //Cycle through
        let player = game.players.shift();
        game.players.push(player);
        game.turn = new Turn(gameId, player);

    }
    else {
        switch (game.turn.status) {
            case 'playing':
                //res.send('<h1>Ongoing Turn!</h1><h2>'+turn.player.character.name+'</h2>'+JSON.stringify(turn.player.hand));
                break;
            default: //res.send('nothing has changed... <br>localhost:3001/game/'+gameId+'/turn/'+game.turn.id+'/card/0');
                console.log(`localhost:3001/game/${gameId}/turn/${game.turn.id}/card/0`);
        }
    }    
    res.render('cards/turn.pug', {
        hand           : game.turn.player.hand,
        lineUp         : game.lineUp,
        turn           : game.turn,
        cardEndPoint   : `http://${req.header('host')}/game/${gameId}/turn/${game.turn.id}/card/`,
        lineUpEndPoint : `http://${req.header('host')}/game/${gameId}/turn/${game.turn.id}/lineup/`,
        endTurnEndPoint: `http://${req.header('host')}/game/${gameId}/turn/${game.turn.id}/end/`,
        prompt         : new Prompt('Type','Prompt from card','Choose fight of flight',['Option1','O2','Opt3'],[],'regular')
    });

    return 200;
});

app.get('/game/:gameId/turn/:turnId/end', function (req, res) {

    let gameId = req.params.gameId,
        game   = getGame(gameId),
        turnId = req.params.turnId;

    if (game.turn.id === turnId) {
        game.endTurn();
    }
    res.send('Turn ended by player.');
    return 200;
});

app.get('/game/:gameId/turn/:turnId/card/:cardIndex', function (req, res) {

    let gameId    = req.params.gameId,
        turnId    = req.params.turnId,
        cardIndex = req.params.cardIndex,
        game      = getGame(gameId);

    if (turnId !== game.turn.id) {
        res.send(`Unexpected turn identification ${turnId}`);
        return 400;
    }
    if (game.turn.player.hand.length == 0) {
        //res.send('No more cards to play in your hand!');
        res.send(`http://localhost:3001/game/${gameId}/turn/${turnId}/lineup/0`);
        return 400;
    }
    if (cardIndex > game.turn.player.hand.length - 1) {
        res.send('Index of card not in range');
        return 400;
    }

    res.send(game.playCard(cardIndex));

    return 200;
});

app.get('/game/:gameId/turn/:turnId/lineup/:cardIndex', function (req, res) {

    let gameId    = req.params.gameId,
        turnId    = req.params.turnId,
        cardIndex = req.params.cardIndex,
        game      = getGame(gameId);

    if (turnId !== game.turn.id) {
        res.send(`Unexpected turn identification ${turnId}`);
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
});

app.get('/cards', function (req, res) {

    let h  = games[games.length - 1].players[0].hand,
        lu = games[games.length - 1].lineUp;

    return 200;
});

app.get('/test', function (req, res) {

    res.sendFile(__dirname+"/public/test.html");
    console.log(io.clients());
});

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data)});

    client.on('Player', function(data){
        console.log(data)});
    });

// app.listen(app.get('port'), function () {
//     //fasdfasd
//     console.log(`Server listening on port ${process.env.port}`);
// });

server.listen(3001);
var express = require('express')
var fs = require('fs')
var app = express()
var allCards;
const Card = require('./src/core/models/card.js')
const Load = require('./src/core/utils/db.js');
const Utils = require('./src/core/utils/utils.js');
const CardLoader = require('./src/core/utils/deckloader.js');


app.get('/load',function(req,res){
    allCards = CardLoader.loadCards(Utils.DC);
    res.send('');
    return 200;
})

app.get('/cards',function(req,res){
    res.send(allCards);
    return 200;
})

app.get('/test',function(req,res){
    var file = fs.readFileSync("./core/cards/starter/punch.json");
    var temp = JSON.parse(file);
    var card = new Card(temp.cardType,temp.name,temp.cost,temp.victoryPoints,temp.description,temp.powers);
    for (i=0; i< card.powers.length; i++)
    {
        console.log(card.powers[i]);
        res.send(card.powers[i] + "Change");
    }

    return 200;
})

app.get('/', function (req, res) {
	var c1 = new Card('a','a','a','a','a','a')
	var r = {};
	r.card = c1;
    Load.query('SELECT * FROM CARD_TYPE', evaluateQuery);
    function evaluateQuery(err,rows,fields)
    {
    	if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    	}

        if (rows) {
            console.log('rows: ' + rows);
            r.res = rows;
        }

        if (fields){
            console.log('fields: ' + fields);
            r.fields = fields;
		}
        res.send(JSON.stringify(r));
        return 200;
    }
})



app.listen(Utils.ENV.port, function() {
    //fasdfasd
    console.log('Server listening on port ' + Utils.ENV.port);
});

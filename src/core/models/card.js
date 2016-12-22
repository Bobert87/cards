class Card{
	constructor (cardType,name,cost,victoryPoints,description,powers)
	{
		this.cardType = cardType;
		this.name = name;
		this.cost = cost;
		this.victoryPoints = victoryPoints;
		this.description = description;
		this.powers = powers;
	}
	toString(){
		return JSON.stringify(this);
	}
}
module.exports = Card;
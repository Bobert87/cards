class Card{
	constructor (cardType,name,cost,victoryPoints,description,powers,image)
	{
		this.cardType = cardType;
		this.name = name;
		this.cost = cost;
		this.image = image;
		this.victoryPoints = victoryPoints;
		this.description = description;
		this.powers = powers;
	}
	toString(){
		return JSON.stringify(this);
	}
}
module.exports = Card;
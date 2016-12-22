class Player{
    constructor (email,nickname,order)
    {
        this.email = email;
        this.nickname = nickname;
        this.order = order;
        this.hand = [];
        this.deck = [];
    }
    toString(){
        return JSON.stringify(this);
    }
}
module.exports = Player;
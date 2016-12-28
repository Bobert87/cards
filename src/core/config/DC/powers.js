/**
 * Created by boris on 12/26/2016.
 */

function addPower(turn, args) {
    let power = args[0];
    console.log('turn power' + turn.power);
    turn.power += power;
    console.log('turn power after adding' + turn.power);
    return 'power added to turn';
}

class Powers {
    constructor() {
        this.addPower = addPower;
    }
}

module.exports = Powers;
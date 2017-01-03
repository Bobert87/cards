/**
 * Created by boris on 12/26/2016.
 */

function addPower(turn, args) {

    let power = args[0];
    turn.power += power;

    return power + ' power added to turn.';
}

class Powers {
    constructor() {
        this.addPower = addPower;
    }
}

module.exports = Powers;
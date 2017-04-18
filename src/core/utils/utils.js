'use strict';

module.exports.ENV = {
    port:3001
};

module.exports.getSetup = function (name) {
    let root = '../config';
    let path = '/dc';
    
    switch (name.toLowerCase()) {
        case 'dc':
            path = '/dc';
            break;
    }
    
    let setup = require(root + path + '/setup/setup.js').Setup;
    let Powers = require(root + path + '/setup/powers.js');
    setup.powers = new Powers();
    return setup;
};

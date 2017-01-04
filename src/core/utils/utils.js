'use strict';

module.exports.ENV = {
    port:3001
};

module.exports.getSetup = function (name) {
    let root = '../config';
    let path = '/DC';
    
    switch (name.toUpperCase()) {
        case 'DC':
            path = '/DC';
            break;
    }
    
    let setup = require(root + path + '/setup.js').Setup;
    let Powers = require(root + path + '/powers.js');
    setup.powers = new Powers();
    return setup;
};

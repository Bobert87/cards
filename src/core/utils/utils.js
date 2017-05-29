'use strict';

let ENV = {
    port:3001
};

/**
 * This will load the setup based on the name. This object contains all the functions related to powers.
 * @param {string} name - The name of the setup to load
 */
function getSetup(name) {
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

module.exports.getSetup = getSetup;
module.exports.ENV = ENV;
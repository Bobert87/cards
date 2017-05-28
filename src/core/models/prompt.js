'use strict'
class Prompt {
    constructor(type,title,description,options,actions,layout) {        
        this.type = type;
        this.title = title;
        this.description = description;
        this.options = options;
        this.actions = actions;
        this.layout = layout;
    }

    toString() {
        return JSON.stringify(this);
    }
}

module.exports = Prompt;

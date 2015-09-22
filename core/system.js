var getGame = require('./macros/getgame');

var System = function(entityManager) {
    this.componentPredicate = function() {
        return true;
    };

    this.componentMap = {};

    this.started = false;

    this.tickRate = 24.0;
};

System.prototype = {
    constructor: System,

    start: function() {},

    //tick
    tick: function(componentMap) {},

    //called after tick
    afterTick: function() {},

    //destroy component, called when component is removed
    destroyComponent: function() {},

    getGame: function() {
        return getGame();
    }
};

module.exports = System;
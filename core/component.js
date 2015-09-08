var uuid = require('uuid-v4');
var getGame = require('../core/macros/getgame');

var Component = function() {
    this.id = uuid();
};

var defaultFunc = function() {};

Component.prototype = {
    constructor: Component,

    defaultFunc: defaultFunc,

    tick: defaultFunc,

    afterTick: defaultFunc,

    getComponent: function(type) {
        return getGame().entityManager.getOwningEntity(this.id).getComponent(type);
    },

    getOwningEntity: function() {
        return getGame().entityManager.getOwningEntity(this.id);
    },

    get transform() {
        return getGame().entityManager.getOwningEntity(this.id).transform;
    },

    getGame: function() {
        return getGame();
    }
};

module.exports = Component;
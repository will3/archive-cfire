var uuid = require('uuid-v4');
var getGame = require('../core/macros/getgame');

var Component = function() {
    this.id = uuid();
    this.started = false;
    this.name = null;
};

var defaultFunc = function() {};

Component.prototype = {
    constructor: Component,

    defaultFunc: defaultFunc,

    start: defaultFunc,

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

    get root() {
        return this.getGame();
    },

    getGame: function() {
        return getGame();
    },

    getEntityByName: function(name) {
        return getGame().entityManager.getEntityByName(name);
    },

    getComponentByName: function(name) {
        return _.find(getGame().entityManager.getOwningEntity(this.id).getComponents(), function(component) {
            return component.name === name;
        });
    },

    notify: function(func, param) {
        var self = this;
        this.getOwningEntity().getComponents().forEach(function(component) {
            if (component == self) {
                return;
            }

            if (component[func] == null) {
                return;
            }

            component[func](param);
        });
    }
};

module.exports = Component;
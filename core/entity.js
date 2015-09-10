var uuid = require('uuid-v4');
var _ = require('lodash');

var TransformComponent = require('./components/transformcomponent');
var getGame = require('./macros/getgame');

var Entity = function() {
    this.id = uuid();

    this.name = null;

    //every entity has a transform component to position within the world
    this.transform = new TransformComponent();
};

Entity.prototype = {
    constructor: Entity,

    addComponent: function(component) {
        if (_.isFunction(component)) {
            var type = component;
            return this.addComponent(new type());

            return;
        }

        var game = getGame();
        return getGame().entityManager.addComponent(this, component);
    },

    removeComponent: function(component) {
        var game = getGame();
        game.entityManager.removeComponent(component.id);
    },

    getComponent: function(type) {
        return _.find(this.getComponents(), function(component) {
            return component instanceof type;
        });
    },

    getComponents: function() {
        return getGame().entityManager.getComponents(this.id);
    },

    getEntityByName: function(name) {
        return getGame().entityManager.getEntityByName(name);
    }
}

module.exports = Entity;
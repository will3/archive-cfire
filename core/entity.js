var uuid = require('uuid-v4');
var _ = require('lodash');

var TransformComponent = require('./components/transformcomponent');
var getGame = require('./macros/getgame');
var types = require('./macros/types');

var Entity = function() {
    this.id = uuid();

    this.name = null;

    //every entity has a transform component to position within the world
    this.transform = new TransformComponent();
};

Entity.prototype = {
    constructor: Entity,

    addComponent: function(component, name) {
        if (_.isString(component)) {
            var type = types[component];
            return this.addComponent(new type(), name);
        }

        if (_.isFunction(component)) {
            var type = component;
            return this.addComponent(new type(), name);
        }

        var game = getGame();

        var component = getGame().entityManager.addComponent(this, component);
        if (name != null) {
            component.name = name;
        }

        return component;
    },

    removeComponent: function(component) {
        var game = getGame();
        game.entityManager.removeComponent(component.id);
    },

    getComponent: function(type) {
        if (_.isFunction(type)) {
            return _.find(this.getComponents(), function(component) {
                return component instanceof type;
            });
        }

        if (_.isString(type)) {
            var types = require('./macros/types');
            var constructor = types[type];
            if (constructor != null) {
                return _.find(this.getComponents(), function(component) {
                    return component instanceof constructor;
                });
            }
        }

        return null;
    },

    getComponents: function() {
        return getGame().entityManager.getComponents(this.id);
    }
}

module.exports = Entity;
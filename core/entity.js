var uuid = require('uuid-v4');
var _ = require('lodash');

var TransformComponent = require('./components/transformcomponent');
var getGame = require('./macros/getgame');

var Entity = function() {
    this.id = uuid();

    //every entity has a transform component to position within the world
    //add to component after init
    this.transform = new TransformComponent();
};

Entity.prototype = {
    constructor: Entity,

    addComponent: function(component) {
        if (_.isFunction(component)) {
            var type = component;
            this.addComponent(new type());

            return;
        }

        var game = getGame();
        getGame().entityManager.addComponent(this, component);
    },

    removeComponent: function(component) {
        var game = getGame();
        game.entityManager.removeComponent(component.id);
    },

    getComponent: function(type) {
        var components = getGame().entityManager.getComponents(this.id);
        return _.find(components, function(component) {
            return component instanceof type;
        });
    }
}

module.exports = Entity;
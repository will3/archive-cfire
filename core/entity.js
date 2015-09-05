var uuid = require('uuid-v4');
var _ = require('lodash');
var TransformComponent = require('./components/transformcomponent');

var Entity = function() {
    this.id = uuid();

    //transform component
    //every entity has a transform component to position within the world
    this.transform = new TransformComponent();

    this.components = [this.transformComponent];
};

Entity.prototype = {
    constructor: Entity,

    addComponent: function(component) {
        this.components.push(component);
    },

    removeComponent: function(component) {
        _.pull(this.components, component);
    },

    get: function(type) {
        return _.find(this.components, function(component) {
            return component instanceof type;
        });
    }
}

module.exports = Entity;
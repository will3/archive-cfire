var _ = require('lodash');
var extend = require('extend');
var types = require('./macros/types');

var Entity = require('./entity');

module.exports = function(game) {
    var game = game;

    return {
        load: function(data) {
            var self = this;
            data.forEach(function(item) {
                var entity = new Entity();
                entity.name = item.name || null;

                game.addEntity(entity);

                var components = item.components;

                components.forEach(function(component) {
                    entity.addComponent(self.getComponent(component));
                });
            });
        },

        getComponent: function(data) {
            if (_.isString(data)) {
                var constructor = types[data];
                return new constructor();
            } else {
                var type = data.type;
                var constructor = types[type];
                var component = new constructor();

                var properties = _.cloneDeep(data);
                delete properties['type'];

                extend(component, properties);

                return component;
            }

            throw "failed to create component";
        }
    };
};
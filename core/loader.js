var _ = require('lodash');
var extend = require('extend');
var types = require('./macros/types');

var Entity = require('./entity');

module.exports = function(game) {
    var game = game;
    var prefabs = {};

    return {
        load: function(data) {
            var self = this;

            prefabs = data.prefabs || {};

            var entities = data.entities || [];
            entities.forEach(function(item) {
                if (_.isString(item)) {
                    var prefab = prefabs[item];
                    if (prefab == null) {
                        throw "cannot find prefab: " + item
                    }

                    self.addEntity(game, prefab);
                    return;
                }

                self.addEntity(game, item);
            });
        },

        addEntity: function(game, item) {
            var entity = new Entity();
            entity.name = item.name || null;

            game.addEntity(entity);

            var components = item.components || [];
            var self = this;
            components.forEach(function(component) {
                entity.addComponent(self.getComponent(component));
            });
        },

        getComponent: function(data) {
            if (_.isString(data)) {
                var constructor = types[data];
                return new constructor();
            } else {
                var type = data.type;
                var constructor = types[type];
                if (constructor == null) {
                    throw "cannot find type: " + type;
                }
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
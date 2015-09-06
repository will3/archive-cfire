var _ = require('lodash');

var EntityManager = function() {
    //entity look up
    this.entities = {};

    //components look up
    this.components = {};
};

EntityManager.prototype = {
    constructor: EntityManager,

    addEntity: function(entity, parent) {
        this.entities[entity.id] = {
            entity: entity,
            entities: [],
            components: [],
            parentId: null
        };

        if (parent != null) {
            this.entities[entity.id].parentId = parent.id;
            this.entities[parent.id].entities.push(entity.id);
        }

        entity.afterInit();
    },

    removeEntity: function(id) {
        var map = this.entities[id];
        var self = this;
        map.entities.forEach(function(childEntityId) {
            self.removeEntity(childEntityId);
        });
        delete this.entities[id];
        map.components.forEach(function(componentId) {
            self.removeComponent(componentId);
        });
        if (map.parentId != null) {
            var parentMap = this.entities[map.parentId];
            _.pull(parentMap.entities, id);
        }
    },

    removeComponent: function(id) {
        var map = this.components[id];
        var entityId = map.entityId;
        var entityMap = this.entities[entityId];
        if (entityMap != null) {
            _.pull(entityMap.components, id);
        }
        delete this.components[id];
    },

    getEntity: function(id) {
        var map = this.entities[id];
        return map == null ? null : map.entity;
    },

    getParentEntity: function(id) {
        var parentId = this.entities[id].parentId;
        return this.entities[parentId].entity;
    },

    getEntities: function(id) {
        if (id == null) {
            return _.map(this.entities, function(entityMap) {
                return entityMap.entity;
            });
        }

        var map = this.entities[id];
        var self = this;
        return _.map(map.entities, function(childEntityId) {
            return self.getEntity(childEntityId);
        });
    },

    addComponent: function(entity, component) {
        var map = this.entities[entity.id];
        map.components.push(component.id);
        this.components[component.id] = {
            component: component,
            entityId: entity.id
        };
    },

    getComponent: function(id) {
        var map = this.components[id];
        return map == null ? null : map.component;
    },

    getComponents: function(id) {
        var map = this.entities[id];
        var self = this;
        return _.map(map.components, function(componentId) {
            return self.getComponent(componentId);
        });
    }
};

module.exports = EntityManager;
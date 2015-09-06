var _ = require('lodash');

var EntityManager = function() {
    this.root = {
        entityIds: []
    }

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
        } else {
            //add to root
            this.root.entityIds.push(entity.id);
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
        } else {
            //remove from root
            _.pull(this.root, id);
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

    getEntityIds: function(id) {
        if (id == null) {
            return this.root.entityIds;
        }

        var map = this.entities[id];
        return map.entities;
    },

    getEntities: function(id) {
        var self = this;
        if (id == null) {
            return _.map(this.root.entityIds, function(rootEntityId) {
                return self.getEntity(rootEntityId);
            });
        }

        var map = this.entities[id];
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
    },

    tick: function() {
        var self = this;
        this.getEntityIds().forEach(function(rootEntityId) {
            self.visitEntity(rootEntityId, function(entity) {
                var components = self.getComponents(entity.id);
                components.forEach(function(component) {
                    component.tick();
                });
            });
        });
    },

    afterTick: function() {
        var self = this;
        this.getEntityIds().forEach(function(rootEntityId) {
            self.visitEntity(rootEntityId, function(entity) {
                var components = self.getComponents(entity.id);
                components.forEach(function(component) {
                    component.afterTick();
                });
            });
        });
    },

    //visit entity and all subEntities
    //root elements gets visited first
    visitEntity: function(id, callback) {
        callback(this.getEntity(id));

        var self = this;
        this.getEntityIds(id).forEach(function(childEntityId) {
            self.visitEntity(childEntityId, callback);
        });
    }
};

module.exports = EntityManager;
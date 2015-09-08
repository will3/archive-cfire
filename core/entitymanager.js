var _ = require('lodash');

var EntityManager = function() {
    this.root = {
        entityIds: []
    }

    //entity look up
    this.entityMap = {};

    //components look up
    this.componentMap = {};
};

EntityManager.prototype = {
    constructor: EntityManager,

    addEntity: function(entity, parent) {
        this.entityMap[entity.id] = {
            entity: entity,
            entityIds: [],
            componentIds: [],
            parentId: null
        };

        if (parent != null) {
            this.entityMap[entity.id].parentId = parent.id;
            this.entityMap[parent.id].entityIds.push(entity.id);
        } else {
            //add to root
            this.root.entityIds.push(entity.id);
        }
    },

    removeEntity: function(id) {
        var map = this.entityMap[id];
        var self = this;
        map.entityIds.forEach(function(childEntityId) {
            self.removeEntity(childEntityId);
        });
        delete this.entityMap[id];
        map.componentIds.forEach(function(componentId) {
            self.removeComponent(componentId);
        });
        if (map.parentId != null) {
            var parentMap = this.entityMap[map.parentId];
            _.pull(parentMap.entityIds, id);
        } else {
            //remove from root
            _.pull(this.root, id);
        }
    },

    removeComponent: function(id) {
        var map = this.componentMap[id];
        var entityId = map.entityId;
        var entityMap = this.entityMap[entityId];
        if (entityMap != null) {
            _.pull(entityMap.componentIds, id);
        }
        delete this.componentMap[id];
    },

    getEntity: function(id) {
        var map = this.entityMap[id];
        return map == null ? null : map.entity;
    },

    getParentEntity: function(id) {
        var parentId = this.entityMap[id].parentId;
        return this.entityMap[parentId].entity;
    },

    getEntityIds: function(id) {
        if (id == null) {
            return this.root.entityIds;
        }

        var map = this.entityMap[id];
        return map.entityIds;
    },

    getEntities: function(id) {
        var self = this;
        if (id == null) {
            return _.map(this.root.entityIds, function(rootEntityId) {
                return self.getEntity(rootEntityId);
            });
        }

        var map = this.entityMap[id];
        return _.map(map.entityIds, function(childEntityId) {
            return self.getEntity(childEntityId);
        });
    },

    addComponent: function(entity, component) {
        var map = this.entityMap[entity.id];
        map.componentIds.push(component.id);
        this.componentMap[component.id] = {
            component: component,
            entityId: entity.id
        };
    },

    getComponent: function(id) {
        var map = this.componentMap[id];
        return map == null ? null : map.component;
    },

    getComponents: function(id) {
        var map = this.entityMap[id];
        var self = this;
        return _.map(map.componentIds, function(componentId) {
            return self.getComponent(componentId);
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
    },

    getOwningEntity: function(id) {
        return this.getEntity(this.componentMap[id].entityId);
    }
};

module.exports = EntityManager;
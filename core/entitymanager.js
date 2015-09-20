var _ = require('lodash');

var EntityManager = function() {
    this.root = {
        entityIds: []
    }

    //entity look up
    this.entityMap = {};

    //components look up
    this.componentMap = {};

    this.addEntityCallbacks = [];
    this.removeEntityCallbacks = [];
    this.addComponentCallbacks = [];
    this.removeComponentCallbacks = [];
};

EntityManager.prototype = {
    constructor: EntityManager,

    onAddEntity: function(callback) {
        this.addEntityCallbacks.push(callback);
    },

    onRemoveEntity: function(callback) {
        this.removeEntityCallbacks.push(callback);
    },

    onAddComponent: function(callback) {
        this.addComponentCallbacks.push(callback);
    },

    onRemoveComponent: function(callback) {
        this.removeComponentCallbacks.push(callback);
    },

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

        this.addEntityCallbacks.forEach(function(callback) {
            callback(entity.id);
        });

        return entity;
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

        this.removeEntityCallbacks.forEach(function(callback) {
            callback(id);
        });
    },

    addComponent: function(entity, component) {
        var map = this.entityMap[entity.id];
        map.componentIds.push(component.id);
        this.componentMap[component.id] = {
            component: component,
            entityId: entity.id
        };

        this.addComponentCallbacks.forEach(function(callback) {
            callback(component.id);
        });

        return component;
    },

    removeComponent: function(id) {
        var map = this.componentMap[id];
        var entityId = map.entityId;
        var entityMap = this.entityMap[entityId];
        if (entityMap != null) {
            _.pull(entityMap.componentIds, id);
        }
        delete this.componentMap[id];

        this.removeComponentCallbacks.forEach(function(callback) {
            callback(id);
        });
    },

    getEntities: function(id) {
        var self = this;
        if(id == null){
            return _.map(this.root.entityIds, function(entityId){
                return self.getEntity(entityId);
            });
        }

        var map = this.entityMap[id];
        return _.map(map.entityIds, function(entityId) {
            return self.getEntity(entityId);
        });
    },

    getEntity: function(id) {
        var map = this.entityMap[id];
        return map == null ? null : map.entity;
    },

    getParentEntity: function(id) {
        var parentId = this.entityMap[id].parentId;
        return parentId == null ? null : this.entityMap[parentId].entity;
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

    getOwningEntity: function(id) {
        return this.getEntity(this.componentMap[id].entityId);
    },

    getEntityByName: function(name) {
        return _(this.entityMap).values().map(function(map) {
            return map.entity;
        }).find(function(entity) {
            return entity.name == name;
        });
    }
};

module.exports = EntityManager;
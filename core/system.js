var System = function(entityManager) {
    this.entityManager = null;

    //set this to specify which entities this system is interested in
    //if null system will loop through every entity
    this.entityPredicate = function() {
        return true;
    };

    this.entities = {};
};

System.prototype = {
    constructor: System,

    //sets entity manager
    //and subscribe to entity events
    //this doesn't add entities retrospectively
    setEntityManager: function(entityManager) {
        this.entityManager = entityManager;

        //subscribe entity events
        this.entityManager.onAddEntity(this.handleAddEntity.bind(this));
        this.entityManager.onRemoveEntity(this.handleRemoveEntity.bind(this));
        this.entityManager.onAddComponent(this.handleAddComponent.bind(this));
        this.entityManager.onRemoveComponent(this.handleRemoveComponent.bind(this));
    },

    tick: function() {},

    afterTick: function() {},

    handleAddEntity: function(id) {
        var entity = this.entityManager.getEntity(id);
        this.evaluateEntity(entity);
    },

    handleRemoveEntity: function(id) {
        delete this.entities[entity.id];
    },

    handleAddComponent: function(id) {
        var entity = this.entityManager.getOwningEntity(id);
        this.evaluateEntity(entity);
    },

    handleRemoveComponent: function(id) {
        var entity = this.entityManager.getOwningEntity(id);
        this.evaluateEntity(entity);
    },

    evaluateEntity: function(entity) {
        if (this.entityPredicate(entity)) {
            this.entities[entity.id] = entity;
        } else {
            delete this.entities[entity.id];
        }
    }
};

module.exports = System;
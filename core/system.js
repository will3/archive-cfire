var System = function(entityManager) {
    this.entityManager = null;

    this.componentPredicate = function() {
        return true;
    };

    this.componentMap = {};
};

System.prototype = {
    constructor: System,

    //sets entity manager
    //and subscribe to entity events
    //this doesn't add entities retrospectively
    setEntityManager: function(entityManager) {
        this.entityManager = entityManager;

        //subscribe entity events
        this.entityManager.onAddComponent(this.handleAddComponent.bind(this));
        this.entityManager.onRemoveComponent(this.handleRemoveComponent.bind(this));
    },

    tick: function() {},

    afterTick: function() {},

    handleAddComponent: function(id) {
        this.evaluateComponent(this.entityManager.getComponent(id));
    },

    handleRemoveComponent: function(id) {
        this.evaluateComponent(this.entityManager.getComponent(id));
    },

    evaluateComponent: function(component) {
        if (this.componentPredicate(component)) {
            this.componentMap[component.id] = component;
        } else {
            delete this.componentMap[component.id];
        }
    }
};

module.exports = System;
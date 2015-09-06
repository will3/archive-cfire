var System = require('../system');

//script manager manages custom components
var ScriptManager = function() {
    System.call(this);

};

ScriptManager.prototype = Object.create(System.prototype);
ScriptManager.prototype.constructor = ScriptManager;

ScriptManager.prototype.tick = function(entityManager) {
    entityManager.getEntityIds().forEach(function(rootEntityId) {
        entityManager.visitEntity(rootEntityId, function(entity) {
            var components = entityManager.getComponents(entity.id);
            components.forEach(function(component) {
                component.tick();
            });
        });
    });
};

ScriptManager.prototype.afterTick = function(entityManager) {
    entityManager.getEntityIds().forEach(function(rootEntityId) {
        entityManager.visitEntity(rootEntityId, function(entity) {
            var components = entityManager.getComponents(entity.id);
            components.forEach(function(component) {
                component.afterTick();
            });
        });
    });
};

module.exports = ScriptManager;
var System = require('../system');

//script manager manages custom components
var ScriptManager = function() {
    System.call(this);

};

ScriptManager.prototype = Object.create(System.prototype);
ScriptManager.prototype.constructor = ScriptManager;

ScriptManager.prototype.tick = function() {
    for (var id in this.entities) {
        var entity = this.entities[id];
        var components = this.entityManager.getComponents(entity.id);

        components.forEach(function(component) {
            component.tick();
        });
    };
};

ScriptManager.prototype.afterTick = function() {
    for (var id in this.entities) {
        var entity = this.entities[id];
        var components = this.entityManager.getComponents(entity.id);

        components.forEach(function(component) {
            component.tick();
        });
    };
};

module.exports = ScriptManager;
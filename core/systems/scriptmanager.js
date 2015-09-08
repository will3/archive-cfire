var System = require('../system');

//script manager manages custom components
var ScriptManager = function() {
    System.call(this);

    this.componentPredicate = function(component) {
        return component.tick != component.defaultFunc || component.afterTick != component.defaultFunc;
    }
};

ScriptManager.prototype = Object.create(System.prototype);
ScriptManager.prototype.constructor = ScriptManager;

ScriptManager.prototype.tick = function() {
    for (var id in this.components) {
        var component = this.components[id];
        component.tick();
    };
};

ScriptManager.prototype.afterTick = function() {
    for (var id in this.components) {
        var component = this.components[id];
        component.afterTick();
    };
};

module.exports = ScriptManager;
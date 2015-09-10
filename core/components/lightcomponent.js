var Component = require('../component');

var LightComponent = function() {
    Component.call(this);

    //light object this component holds
    this.light = null;
}

LightComponent.prototype = Object.create(Component.prototype);
LightComponent.prototype.constructor = LightComponent;

module.exports = LightComponent;
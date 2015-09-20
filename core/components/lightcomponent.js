var Component = require('../component');

var LightComponent = function() {
    Component.call(this);

    this.needsRedraw = false;

    this.adddedToScene = false;

    //ambient / directional
    this.lightType = null;

    //color
    this.color = null;

    //intensity
    this.intensity = null;

    //position
    this.position = null;
}

LightComponent.prototype = Object.create(Component.prototype);
LightComponent.prototype.constructor = LightComponent;

module.exports = LightComponent;
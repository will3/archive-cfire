var Component = require('../component');

var LightComponent = function() {
    Component.call(this);

    //light object this component holds
    this._light = null;

    this.needsRedraw = false;

    this.adddedToScene = false;
}

LightComponent.prototype = Object.create(Component.prototype);
LightComponent.prototype.constructor = LightComponent;

Object.defineProperty(LightComponent.prototype, 'light', {
    get: function() {
        return this._light;
    },
    set: function(value) {
        this._light = value;
    }
});

module.exports = LightComponent;
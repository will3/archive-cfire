var System = require('../system');
var LightComponent = require('../components/lightcomponent');

var Lighting = function(renderer) {
    System.call(this);

    this.renderer = renderer;
    this.scene = this.renderer.scene;

    this.componentPredicate = function(component) {
        return component instanceof LightComponent;
    };

    this.lightMap = {};
};

Lighting.prototype = Object.create(System.prototype);
Lighting.prototype.constructor = Lighting;

Lighting.prototype.addLight = function(component) {
    this.scene.add(component.light);
    this.lightMap[component.id] = component.light;
};

Lighting.prototype.tick = function() {
    for (var id in this.componentMap) {
        var component = this.componentMap[id];

        if (this.lightMap[id] == null && component.light != null) {
            this.addLight(component);
        } else if (this.lightMap[id] != component.light) {
            this.scene.remove(component.light);
            delete this.lightMap[component.id];

            if (component.light != null) {
                this.addLight(component);
            }
        }
    }
};

module.exports = Lighting;
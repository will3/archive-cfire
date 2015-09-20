var System = require('../system');
var LightComponent = require('../components/lightcomponent');

var Lighting = function(renderer) {
    System.call(this);

    this.renderer = renderer;
    this.scene = this.renderer.scene;
    this.edgeScene = this.renderer.edgeScene;

    this.componentPredicate = function(component) {
        return component instanceof LightComponent;
    };

    this.lightMap = {};
};

Lighting.prototype = Object.create(System.prototype);
Lighting.prototype.constructor = Lighting;

Lighting.prototype.addLight = function(component) {
    this.scene.add(component.light);
    var edgeLight = component.light.clone();
    this.edgeScene.add(edgeLight);
    this.lightMap[component.id] = [component.light, edgeLight];
};

Lighting.prototype.tick = function() {
    for (var id in this.componentMap) {
        var component = this.componentMap[id];

        if (!component.addedToScene || component.needsUpdate) {
            var lights = this.lightMap[id];
            if (lights == null) {
                lights = this.lightMap[id] = [];
            }

            lights.forEach(function(light) {
                light.parent.remove(light);
            });

            this.addLight(component);

            component.addedToScene = true;
        }

    }
};

module.exports = Lighting;
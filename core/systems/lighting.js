var THREE = require('three');
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
    var light = this.getLight(component);
    if (light == null) {
        return;
    }
    this.scene.add(light);
    var edgeLight = light.clone();
    this.edgeScene.add(edgeLight);
    this.lightMap[component.id] = [light, edgeLight];
};

Lighting.prototype.getLight = function(component) {
    switch (component.lightType) {
        case 'ambient':
            return new THREE.AmbientLight(component.color);

        case 'directional':
            {
                var light = new THREE.DirectionalLight(component.color, component.intensity);
                light.position.set(component.position.x, component.position.y, component.position.z);
                return light;
            }
        default:
            return null;
    }
}

Lighting.prototype.tick = function(componentMap) {
    for (var id in componentMap) {
        var component = componentMap[id];

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
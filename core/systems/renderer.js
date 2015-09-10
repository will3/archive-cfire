var RenderComponent = require("../components/rendercomponent");
var THREE = require("three");
var System = require('../system');

var Renderer = function(container, window) {
    System.call(this);

    this.container = container;
    this.window = window;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, this.window.innerWidth / this.window.innerHeight, 1, 10000);
    this.camera.rotation.order = 'YXZ';

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);

    this.renderer.setClearColor(0xffffff, 1);

    container.append(this.renderer.domElement);

    this.componentPredicate = function(component) {
        return component instanceof RenderComponent;
    }
};

Renderer.prototype = Object.create(System.prototype);
Renderer.prototype.constructor = Renderer;

Renderer.prototype.tick = function() {
    var self = this;

    for (var id in this.componentMap) {
        var renderComponent = this.componentMap[id];

        //add object to scene
        if (!renderComponent.addedToScene) {
            self.scene.add(renderComponent.object);
            renderComponent.addedToScene = true;
        }

        //copy position, rotation and scale from entity
        renderComponent.object.position.copy(renderComponent.transform.position);
        renderComponent.object.rotation.copy(renderComponent.transform.rotation);
        renderComponent.object.scale.copy(renderComponent.transform.scale);
    }

    this.renderer.render(this.scene, this.camera);
};

module.exports = Renderer;
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
};

Renderer.prototype = Object.create(System.prototype);
Renderer.prototype.constructor = Renderer;

Renderer.prototype.tick = function() {
    var self = this;

    for (var id in this.entities) {
        var entity = this.entities[id];

        var renderComponent = entity.getComponent(RenderComponent);

        //ignore entities with no render components
        if (renderComponent == null) {
            return;
        }

        //add object to scene
        if (!renderComponent.addedToScene) {
            self.scene.add(renderComponent.object);
            renderComponent.addedToScene = true;
        }

        //copy position, rotation and scale from entity
        renderComponent.object.position.copy(entity.transform.position);
        renderComponent.object.rotation.copy(entity.transform.rotation);
        renderComponent.object.scale.copy(entity.transform.scale);
    }

    this.renderer.render(this.scene, this.camera);
};

module.exports = Renderer;
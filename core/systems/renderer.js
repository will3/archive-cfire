var RenderComponent = require("../components/rendercomponent");
var THREE = require("three");

var Renderer = function(container, window) {
    this.container = container;
    this.window = window;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, this.window.innerWidth / this.window.innerHeight, 1, 10000);

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);

    this.renderer.setClearColor(0xffffff, 1);

    container.append(this.renderer.domElement);
};

Renderer.prototype = {
    constructor: Renderer,

    isDrawable: function(entity) {
        return entity.get(RenderComponent) != null;
    },

    tick: function(world) {
        var self = this;

        world.entities.forEach(function(entity) {
            var renderComponent = entity.get(RenderComponent);

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
        });

        this.renderer.render(this.scene, this.camera);
    }
}

module.exports = Renderer;
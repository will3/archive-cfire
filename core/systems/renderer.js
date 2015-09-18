var RenderComponent = require('../components/rendercomponent');
var CollisionBody = require('../components/collisionbody');
var THREE = require('three');
var System = require('../system');
var resized = require('../utils/resized');

var $ = require('jquery');

var Renderer = function(container, window) {
    System.call(this);

    this.container = container;
    this.window = window;

    this.scene = new THREE.Scene();

    this.camera = this.getCamera();

    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    this.updateRendererSize();

    this.renderer.setClearColor(0xffffff, 1);

    container.append(this.renderer.domElement);

    this.componentPredicate = function(component) {
        return component instanceof RenderComponent;
    }

    //object look up, by component id
    this.objectMap = {};

    var self = this;
    resized(function() {
        self.camera = self.getCamera();
        self.updateRendererSize();
    });
};

Renderer.prototype = Object.create(System.prototype);
Renderer.prototype.constructor = Renderer;

Renderer.prototype.getCamera = function() {
    var camera = new THREE.PerspectiveCamera(75, this.window.innerWidth / this.window.innerHeight, 1, 10000);
    camera.rotation.order = 'YXZ';

    return camera;
};

Renderer.prototype.updateRendererSize = function() {
    this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);
};

Renderer.prototype.addObject = function(renderComponent) {
    this.scene.add(renderComponent.object);
    this.objectMap[renderComponent.id] = renderComponent.object;
};

Renderer.prototype.tick = function() {
    for (var id in this.componentMap) {
        var renderComponent = this.componentMap[id];

        //add to map
        if (this.objectMap[renderComponent.id] == null) {
            if (renderComponent.object != null) {
                this.addObject(renderComponent);
            }
        } else if (this.objectMap[id] != renderComponent.object) {
            this.scene.remove(this.objectMap[renderComponent.id]);
            delete this.objectMap[renderComponent.id];

            if (renderComponent.object != null) {
                this.addObject(renderComponent);
            }
        }

        if (renderComponent.object == null) {
            continue;
        }

        //copy position, rotation and scale from entity
        renderComponent.object.position.copy(renderComponent.transform.position);
        renderComponent.object.rotation.copy(renderComponent.transform.rotation);
        renderComponent.object.scale.copy(renderComponent.transform.scale);
        renderComponent.object.visible = renderComponent.visible;
    }

    this.renderer.render(this.scene, this.camera);
};

module.exports = Renderer;
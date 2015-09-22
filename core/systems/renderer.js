require('../utils/loadthree');

var $ = require('jquery');
var assert = require('assert-plus');

var RenderComponent = require('../components/rendercomponent');
var CollisionBody = require('../components/collisionbody');
var THREE = require('three');
var System = require('../system');
var resized = require('../utils/resized');

var Renderer = function(container) {
    System.call(this);

    this.container = container;

    this.componentPredicate = function(component) {
        return component instanceof RenderComponent;
    }

    //object look up, by component id
    this.objectMap = {};

    this.scene = new THREE.Scene();
    this.edgeScene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.rotation.order = 'YXZ';
    this.camera.position.z = 100;

    this.clearColor = 0xffffff;

    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(this.clearColor);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    assert.object(container[0], "container");
    container.append(renderer.domElement);

    this.renderer = renderer;

    //set up resize
    resized(this.onWindowResize.bind(this));
};

Renderer.prototype = Object.create(System.prototype);
Renderer.prototype.constructor = Renderer;

Renderer.prototype.setClearColor = function(value) {
    this.renderer.setClearColor(value);
};

Renderer.prototype.onWindowResize = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
};

Renderer.prototype.start = function() {
    this.animate();
};

Renderer.prototype.animate = function() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
};

Renderer.prototype.render = function() {
    this.renderer.render(this.scene, this.camera);
};

Renderer.prototype.tick = function(componentMap) {
    for (var id in componentMap) {
        var renderComponent = componentMap[id];

        if (renderComponent.needsUpdate || !renderComponent.addedToScene) {
            if (this.objectMap[id] != null) {
                this.removeObject3D(renderComponent);
            }
            if (renderComponent.object != null) {
                this.addObject3D(renderComponent);
            }

            renderComponent.addedToScene = true;
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
};

Renderer.prototype.destroyComponent = function(component) {
    this.removeObject3D(component);
};

Renderer.prototype.addObject3D = function(renderComponent) {
    var object = renderComponent.object;
    this.scene.add(object);
    var objects = [object];

    this.objectMap[renderComponent.id] = objects;
};

Renderer.prototype.removeObject3D = function(renderComponent) {
    var objects = this.objectMap[renderComponent.id];
    if (objects == null) {
        return;
    }

    objects.forEach(function(object) {
        object.parent.remove(object);
    });
};

module.exports = Renderer;
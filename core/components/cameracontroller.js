var THREE = require('three');
var Component = require('../../core/component');
var clamp = require('clamp');

var CameraController = function() {
    Component.call(this);

    this.distance = 1000;

    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
    this.lookAt = new THREE.Vector3(0, 0, 0);

    this.rotation.x = -Math.PI / 4.0;
    this.rotation.y = Math.PI / 4.0;

    this.maxPitch = Math.PI / 2.0;
    this.minPitch = -Math.PI / 2.0;

    this.lastX = null;
    this.lastY = null;

    this.xSpeed = 0.004;
    this.ySpeed = 0.004;

    this.mousehold = false;
};

CameraController.prototype = Object.create(Component.prototype);
CameraController.prototype.constructor = CameraController;

CameraController.prototype.start = function() {
    this.bindMouseMove(function(e) {
        var mousehold = this.root.input.mousehold;
        if (this.lastX != null && this.lastY != null) {
            if (mousehold) {
                var dragX = e.x - this.lastX;
                var dragY = e.y - this.lastY;

                this.rotateCamera({
                    x: dragX * this.xSpeed,
                    y: dragY * this.ySpeed
                });
            }
        }

        this.lastX = e.x;
        this.lastY = e.y;
    }.bind(this));
};

CameraController.prototype.rotateCamera = function(amount) {
    this.rotation.y -= amount.x;
    this.rotation.x -= amount.y;

    this.rotation.x = clamp(this.rotation.x, this.minPitch, this.maxPitch);
    this.updatePosition();
};

CameraController.prototype.tick = function() {
    this.updatePosition();
};

CameraController.prototype.zoom = function(scale) {
    this.distance = this.distance * scale;
    this.updatePosition();
};

CameraController.prototype.updatePosition = function() {
    var camera = this.getGame().camera;

    camera.rotation.x = this.rotation.x;
    camera.rotation.y = this.rotation.y;

    var position = new THREE.Vector3(0, 0, this.distance).applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(this.rotation));
    position.add(this.lookAt);
    camera.position.copy(position);
};

module.exports = CameraController;
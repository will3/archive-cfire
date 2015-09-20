var THREE = require('three');
var Component = require('../../core/component');
var clamp = require('clamp');

var CameraController = function() {
    Component.call(this);

    this.distance = 1000;

    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');

    this.rotation.x = -Math.PI / 4.0;
    this.rotation.y = Math.PI / 4.0;

    this.maxPitch = Math.PI / 2.0;
    this.minPitch = -Math.PI / 2.0;
};

CameraController.prototype = Object.create(Component.prototype);
CameraController.prototype.constructor = CameraController;

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
    camera.position.copy(position);
};

module.exports = CameraController;
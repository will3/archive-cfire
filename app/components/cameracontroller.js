var THREE = require('three');
var Component = require('../../core/component');

var CameraController = function() {
    Component.call(this);

    this.distance = 1000;

    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
};

CameraController.prototype = Object.create(Component.prototype);
CameraController.prototype.constructor = CameraController;

CameraController.prototype.rotateCamera = function(amount) {
    var camera = this.getGame().camera;

    this.rotation.y -= amount.x;
    this.rotation.x -= amount.y;

    var position = new THREE.Vector3(0, 0, this.distance).applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(this.rotation));

    camera.position.copy(position);

    camera.rotation.x = this.rotation.x;
    camera.rotation.y = this.rotation.y;
};

module.exports = CameraController;
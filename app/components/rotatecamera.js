var THREE = require('three');
var Component = require('../../core/component');

var RotateCamera = function() {
    Component.call(this);

    this.xSpeed = 0.004;
    this.ySpeed = 0.004;
    this.distance = 1000;

    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
};

RotateCamera.prototype = Object.create(Component.prototype);
RotateCamera.prototype.constructor = RotateCamera;

RotateCamera.prototype.tick = function() {
    var game = this.getGame();
    var camera = game.camera;
    var input = game.input;

    this.rotation.y -= input.mouseDragX * this.xSpeed;
    this.rotation.x -= input.mouseDragY * this.ySpeed;

    var position = new THREE.Vector3(0, 0, this.distance).applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(this.rotation));

    camera.position.copy(position);

    camera.rotation.x = this.rotation.x;
    camera.rotation.y = this.rotation.y;
};

module.exports = RotateCamera;
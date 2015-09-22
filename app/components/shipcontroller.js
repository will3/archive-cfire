var assert = require('assert-plus');
var clamp = require('clamp');

var Engine = require('../../core/engine');
var Component = Engine.Component;

var ShipController = function() {
    Component.call(this);

    this.rigidBody = null;

    this.maxRoll = Math.PI / 4;
    this.minRoll = -Math.PI / 4;

    this.rollFriction = 1.0;
    this.rollFrictionCurve = 0.05;

    this.yawSpeed = 0.02;
};

ShipController.prototype = Object.create(Component.prototype);
ShipController.prototype.constructor = ShipController;

ShipController.prototype.start = function() {
    this.rigidBody = this.getComponent('RigidBody');
    assert.object(this.rigidBody, 'rigidBody');

    this.rigidBody.mass = 100;
};

ShipController.prototype.tick = function() {
    this.accelerate(1);
    this.bank(1);

    //update yaw with bank
    var rotation = this.transform.rotation;
    rotation.y += Math.sin(rotation.z) * this.yawSpeed;
};

ShipController.prototype.accelerate = function(amount) {
    var unitFacing = new THREE.Vector3(0, 0, 1).applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(this.transform.rotation));
    this.rigidBody.applyForce(unitFacing.multiplyScalar(-amount));
};

ShipController.prototype.bank = function(amount) {
    var rotation = this.transform.rotation;
    rotation.z += amount;
    rotation.z = clamp(rotation.z, this.minRoll, this.maxRoll);

    rotation.z *= Math.pow(Math.cos(rotation.z / this.maxRoll), this.rollFrictionCurve) * this.rollFriction;
};

module.exports = ShipController;
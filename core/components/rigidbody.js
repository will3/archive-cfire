var assert = require('assert-plus');
var THREE = require('three');

var Component = require('../component');

var RigidBody = function() {
    Component.call(this);

    this.transform = null;

    //acceleration
    this.acceleration = new THREE.Vector3();

    //velocity
    this.velocity = new THREE.Vector3();

    //mass, immovable by default
    this.mass = Infinity;
};

RigidBody.prototype = Object.create(Component.prototype);
RigidBody.prototype.constructor = RigidBody;

RigidBody.prototype.applyForce = function(force) {
    var acceleration = force.clone().multiplyScalar(1 / this.mass);
    this.acceleration.add(acceleration);
};

module.exports = RigidBody;
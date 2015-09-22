var System = require('../system');
var RigidBody = require('../components/rigidbody');

var Physics = function() {
    System.call(this);

    this.componentPredicate = function(component) {
        return component instanceof RigidBody;
    }

    this.friction = 0.99;
};

Physics.prototype = Object.create(System.prototype);
Physics.prototype.constructor = Physics;

Physics.prototype.start = function() {

};

Physics.prototype.tick = function(componentMap) {
    for (var id in componentMap) {
        var component = componentMap[id];
        this.stepComponent(component);
    }
};

Physics.prototype.stepComponent = function(component) {
    component.velocity.add(component.acceleration).multiplyScalar(this.friction);
    component.transform.position.add(component.velocity);
    component.acceleration = new THREE.Vector3(0, 0, 0);
};

module.exports = Physics;
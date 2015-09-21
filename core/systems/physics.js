var System = require('../system');
var RigidBody = require('../components/rigidbody');

var Physics = function() {
    System.call(this);

    this.componentPredicate = function(component) {
        return component instanceof RigidBody;
    }
};

Physics.prototype = Object.create(System.prototype);
Physics.prototype.constructor = Physics;

Physics.prototype.start = function() {

};

Physics.prototype.tick = function() {
    for (var id in this.componentMap) {
        var component = this.componentMap[id];
        this.step(component);
    }
};

Physics.prototype.step = function(component) {
	
};

module.exports = Physics;
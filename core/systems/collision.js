var System = require('../system');
var CollisionBody = require('../components/collisionbody');

var Collision = function() {
    System.call(this);

    this.componentPredicate = function(component) {
        return component instanceof CollisionBody;
    }
};

Collision.prototype = Object.create(System.prototype);
Collision.prototype.constructor = Collision;

Collision.prototype.tick = function() {
    //todo
};

module.exports = Collision;
var Component = require('../component');

var CollisionBody = function() {
    Component.call(this);

    //object to use for collision mesh
    this.object = null;
};

CollisionBody.prototype = Object.create(Component.prototype);
CollisionBody.prototype.constructor = CollisionBody;

module.exports = CollisionBody;
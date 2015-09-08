var Component = require('../component');

var CollisionBody = function() {
    Component.call(this);

    //geometry to use for collision mesh
    this.geometry = null;
};

CollisionBody.prototype = Object.create(Component.prototype);
CollisionBody.prototype.constructor = CollisionBody;

module.exports = CollisionBody;
var Component = require('../component');
var THREE = require('three');

var TransformComponent = function() {
    Component.call(this);

    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
    this.scale = new THREE.Vector3(1, 1, 1);
};

TransformComponent.prototype = Object.create(Component.prototype);
TransformComponent.prototype.constructor = TransformComponent;

module.exports = TransformComponent;
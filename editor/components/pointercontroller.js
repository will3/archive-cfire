var Component = require('../../core/component');
var RenderComponent = require('../../core/components/RenderComponent');
var assert = require('assert-plus');
var THREE = require('three');

var PointerController = function() {
    Component.call(this);

    this.renderComponent = null;
    this.gridSize = 50;
};

PointerController.prototype = Object.create(Component.prototype);
PointerController.prototype.constructor = PointerController;

PointerController.prototype.start = function() {
    this.renderComponent = this.getComponent('RenderComponent');
    assert.object(this.renderComponent, 'renderComponent');

    this.cube = this.makeCube();
    this.renderComponent.object = this.cube;
};

PointerController.prototype.setGridSize = function(gridSize) {
    this.gridSize = gridSize;
};

PointerController.prototype.setCoord = function(coord) {
    this.transform.position.x = coord.x * this.gridSize;
    this.transform.position.y = coord.y * this.gridSize;
    this.transform.position.z = coord.z * this.gridSize;
};

PointerController.prototype.setVisible = function(visible) {
    this.renderComponent.visible = visible;
};

PointerController.prototype.makeCube = function() {
    geometry = new THREE.BoxGeometry(50, 50, 50, 2, 2, 2);
    material = new THREE.MeshBasicMaterial();
    var object = new THREE.Mesh(geometry, material);
    var edges = new THREE.EdgesHelper(object, 0xEE0000);
    var cube = new THREE.Object3D();
    cube.add(edges);

    return cube;
};

module.exports = PointerController;
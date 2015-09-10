var assert = require('assert-plus');
var THREE = require('three');

var Component = require('../../core/component');
var RenderComponent = require('../../core/components/rendercomponent');
var CollisionBody = require('../../core/components/collisionbody');
var mesh = require('../../core/block/mesh');
var Chunk = require('../../core/block/chunk');

var ChunkController = function() {
    Component.call(this);

    this.renderComponent = null;

    this.gridSize = 50;

    this.chunk = new Chunk();

    this.faceMap = {};
}

ChunkController.prototype = Object.create(Component.prototype);
ChunkController.prototype.constructor = ChunkController;

ChunkController.prototype.start = function() {
    this.renderComponent = this.getComponent(RenderComponent);
    this.collisionBody = this.getComponent(CollisionBody);
    assert.object(this.renderComponent, 'renderComponent');
    assert.object(this.collisionBody, 'collisionBody');
};

ChunkController.prototype.addBlock = function(coord) {
    this.chunk.add(coord.x, coord.y, coord.z, '0');
    this.updateObjects();
};

ChunkController.prototype.removeBlock = function(coord) {
    this.chunk.remove(coord.x, coord.y, coord.z);
    this.updateObjects();
}

ChunkController.prototype.updateObjects = function() {
    var geometry = mesh(this.chunk, {
        gridSize: this.gridSize,
        faceMap: this.faceMap
    });

    var material = new THREE.MeshLambertMaterial({
        color: 0xAAAAAA
    });

    var object = new THREE.Mesh(geometry, material);
    var edges = new THREE.EdgesHelper(object, 0xAAAAAA);

    var renderObject = new THREE.Object3D();
    renderObject.add(object);
    renderObject.add(edges);

    this.renderComponent.object = renderObject;
    this.collisionBody.object = object;
};

module.exports = ChunkController;
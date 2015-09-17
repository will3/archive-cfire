var assert = require('assert-plus');
var THREE = require('three');

var Component = require('../../core/component');
var RenderComponent = require('../../core/components/rendercomponent');
var CollisionBody = require('../../core/components/collisionbody');
var mesh = require('../../core/block/mesh');
var serialize = require('../../core/block/serialize');
var deserialize = require('../../core/block/deserialize');
var Chunk = require('../../core/block/chunk');

var ChunkController = function() {
    Component.call(this);

    this.renderComponent = null;

    this.gridSize = 50;

    this.chunk = new Chunk();

    this.faceMap = {};

    this.lineColor = 0x333333;
}

ChunkController.prototype = Object.create(Component.prototype);
ChunkController.prototype.constructor = ChunkController;

ChunkController.prototype.start = function() {
    this.renderComponent = this.getComponent(RenderComponent);
    this.collisionBody = this.getComponent(CollisionBody);
    assert.object(this.renderComponent, 'renderComponent');
    assert.object(this.collisionBody, 'collisionBody');
};

ChunkController.prototype.addBlock = function(coord, block) {
    block = block || {};
    this.chunk.add(coord.x, coord.y, coord.z, block);
    this.updateObjects();
};

ChunkController.prototype.removeBlock = function(coord) {
    this.chunk.remove(coord.x, coord.y, coord.z);
    this.updateObjects();
}

ChunkController.prototype.updateObjects = function() {
    var object = mesh(this.chunk, {
        gridSize: this.gridSize,
        faceMap: this.faceMap
    });

    var edges = new THREE.EdgesHelper(object, this.lineColor);

    var renderObject = new THREE.Object3D();
    renderObject.add(object);
    renderObject.add(edges);

    this.renderComponent.object = renderObject;
    this.collisionBody.object = object;
};

ChunkController.prototype.reset = function() {
    this.chunk = new Chunk();
    this.updateObjects();
};

ChunkController.prototype.serialize = function() {
    return serialize(this.chunk);
};

ChunkController.prototype.load = function(json) {
    this.chunk = deserialize(json);
    this.updateObjects();
};

module.exports = ChunkController;
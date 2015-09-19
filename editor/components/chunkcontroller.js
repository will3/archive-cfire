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
    var block = this.chunk.remove(coord.x, coord.y, coord.z);
    this.updateObjects();
    return block;
}

ChunkController.prototype.updateObjects = function() {
    var edges = [];
    var object = mesh(this.chunk, {
        gridSize: this.gridSize,
        faceMap: this.faceMap,
        edges: edges
    });

    var geometry = new THREE.Geometry();
    for (var i in edges) {
        var edge = edges[i];
        geometry.vertices.push(edge.start);
        geometry.vertices.push(edge.end);
    };

    var edgeObject = new THREE.Line(geometry, new THREE.LineBasicMaterial({
        color: 0x000000,
    }), THREE.LinePieces);

    var renderObject = new THREE.Object3D();
    renderObject.add(object);
    // renderObject.add(edgeObject);

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
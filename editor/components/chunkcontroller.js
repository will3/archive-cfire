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
    this.wireFrameRenderComponent = null;

    this.gridSize = 50;

    this.chunk = new Chunk();

    this.faceMap = {};

    this.lineColor = 0x333333;

    this.wireFrameHidden = true;
}

ChunkController.prototype = Object.create(Component.prototype);
ChunkController.prototype.constructor = ChunkController;

ChunkController.prototype.start = function() {
    this.collisionBody = this.getComponent(CollisionBody);
    this.renderComponent = this.getComponentByName('renderComponent');
    this.wireFrameRenderComponent = this.getComponentByName('wireFrameRenderComponent');

    assert.object(this.wireFrameRenderComponent, 'wireFrameRenderComponent');
    assert.object(this.renderComponent, 'renderComponent');
    assert.object(this.collisionBody, 'collisionBody');

    this.updateObjects();
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

    this.wireFrameRenderComponent.visible = !this.wireFrameHidden;

    this.renderComponent.object = object;

    var wireframe = new THREE.WireframeHelper(object, 0x000000);
    this.wireFrameRenderComponent.object = wireframe;
    this.collisionBody.object = object;
};

ChunkController.prototype.reset = function() {
    this.chunk = new Chunk();
    this.updateObjects();
};

ChunkController.prototype.setChunk = function(chunk) {
    this.chunk = chunk;
    this.updateObjects();
};

ChunkController.prototype.serialize = function() {
    return serialize(this.chunk);
};

ChunkController.prototype.load = function(json) {
    this.chunk = deserialize(json);
    this.updateObjects();
};

ChunkController.prototype.loadFromUrl = function() {
    var data = require('../geturlparameter')('b');
    if (data == null) {
        return;
    }
    var json = JSON.parse(require('lz-string').decompressFromEncodedURIComponent(data));
    this.chunk = deserialize(json);
    if (this.started) {
        this.updateObjects();
    }
};

ChunkController.prototype.setWireFrameHidden = function(hidden) {
    this.wireFrameHidden = hidden;
    this.updateObjects();
};

module.exports = ChunkController;
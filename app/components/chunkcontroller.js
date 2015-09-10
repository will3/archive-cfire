var assert = require('assert-plus');
var THREE = require('three');

var Component = require('../../core/component');
var RenderComponent = require('../../core/components/rendercomponent');
var mesh = require('../../core/block/mesh');
var Chunk = require('../../core/block/chunk');

var ChunkController = function() {
    Component.call(this);

    this.renderComponent = null;

    this.gridSize = 50;

    this.chunk = new Chunk();
}

ChunkController.prototype = Object.create(Component.prototype);
ChunkController.prototype.constructor = ChunkController;

ChunkController.prototype.start = function() {
    this.renderComponent = this.getComponent(RenderComponent);
    assert.object(this.renderComponent, 'renderComponent');
};

ChunkController.prototype.addBlock = function(coord) {
    this.chunk.add(coord.x, coord.y, coord.z, '0');

    var geometry = mesh(this.chunk);

    var object = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: '0xff0000'
    }));

    this.renderComponent.object = object;
    this.renderComponent.needsRedraw = true;
};

module.exports = ChunkController;
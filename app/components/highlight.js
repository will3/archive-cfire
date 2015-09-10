var THREE = require('three');
var assert = require('assert-plus');

var Component = require('../../core/component');
var Grid = require('./grid');
var ChunkController = require('./chunkcontroller');

var Highlight = function() {
    Component.call(this);

    this.cube = null;

    this.grid = null;
    this.chunkController = null;

    this.clickThreshold = 200;
    this.lastMousedownTime = null;
};

Highlight.prototype = Object.create(Component.prototype);
Highlight.prototype.constructor = Highlight;

Highlight.prototype.start = function() {
    this.grid = this.getEntityByName('grid').getComponent(Grid);
    this.chunkController = this.getEntityByName('chunk').getComponent(ChunkController);

    assert.object(this.grid, 'grid');
    assert.object(this.chunkController, 'chunkController');
};

Highlight.prototype.tick = function() {
    var collision = this.getGame().getMouseCollision();

    if (collision == null) {
        if (this.cube != null) {
            this.cube.visible = false;
        }
        return;
    }

    var body = collision.body;
    var entity = body.getOwningEntity();
    var intersect = collision.intersect;

    if (this.cube == null) {
        geometry = new THREE.BoxGeometry(50, 50, 50, 2, 2, 2);
        material = new THREE.MeshBasicMaterial();
        var object = new THREE.Mesh(geometry, material);
        var edges = new THREE.EdgesHelper(object, 0xEE0000);
        this.cube = new THREE.Object3D();
        this.cube.add(edges);
        this.getGame().addObject3d(this.cube);
    }

    this.cube.visible = true;

    var gridSize = this.grid.gridSize;

    var x = Math.floor(intersect.point.x / gridSize);
    var z = Math.floor(intersect.point.z / gridSize);

    this.cube.position.x = x * gridSize + gridSize / 2.0;
    this.cube.position.z = z * gridSize + gridSize / 2.0;
    this.cube.position.y = this.grid.gridY * gridSize + gridSize / 2.0;

    var input = this.getGame().input;
    if (input.mousedown) {
        this.lastMousedownTime = new Date().getTime();
    }

    if (input.mouseup && this.lastMousedownTime != null) {
        var diff = new Date().getTime() - this.lastMousedownTime;

        if (diff < this.clickThreshold) {

            var coord = {
                x: x,
                y: this.grid.gridY,
                z: z
            }

            this.chunkController.addBlock(coord);

        }
    }
};

module.exports = Highlight;
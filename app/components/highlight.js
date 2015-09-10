var THREE = require('three');
var assert = require('assert-plus');
var _ = require('lodash');

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

    var input = this.getGame().input;
    var isRemove = input.keyhold('shift');
    var coord = this.getCoord(intersect, entity, isRemove);

    if (coord == null) {
        return;
    }

    var gridSize = this.grid.gridSize;
    this.cube.position.x = coord.x * gridSize;
    this.cube.position.y = coord.y * gridSize;
    this.cube.position.z = coord.z * gridSize;

    if (input.mousedown) {
        this.lastMousedownTime = new Date().getTime();
    }

    if (input.mouseup && this.lastMousedownTime != null) {
        var diff = new Date().getTime() - this.lastMousedownTime;

        if (diff < this.clickThreshold) {
            if (isRemove) {
                this.chunkController.removeBlock(coord);
            } else {
                this.chunkController.addBlock(coord);
            }
        }
    }

    if (input.keydown('w')) {
        this.grid.gridY += 1;
        this.grid.updateObjects();
    }

    if (input.keydown('s')) {
        this.grid.gridY -= 1;
        this.grid.updateObjects();
    }
};

Highlight.prototype.getCoord = function(intersect, entity, isRemove) {
    var gridSize = this.grid.gridSize;
    var halfGridSize = gridSize / 2.0;

    if (entity == this.grid.getOwningEntity()) {
        return {
            x: Math.floor((intersect.point.x + halfGridSize) / gridSize),
            y: this.grid.gridY,
            z: Math.floor((intersect.point.z + halfGridSize) / gridSize)
        };
    } else if (entity == this.chunkController.getOwningEntity()) {
        var faceIndex = intersect.faceIndex;
        var faceData = this.chunkController.faceMap[faceIndex];

        var coord = _.cloneDeep(faceData.coord);

        if (isRemove) {
            return coord;
        }

        var side = faceData.side;

        switch (side) {
            case 'left':
                coord.x--;
                return coord;
            case 'right':
                coord.x++;
                return coord;
            case 'bottom':
                coord.y--;
                return coord;
            case 'top':
                coord.y++;
                return coord;
            case 'back':
                coord.z--;
                return coord;
            case 'front':
                coord.z++;
                return coord;
            default:
                return null;
        }

    }

    return null;
};

module.exports = Highlight;
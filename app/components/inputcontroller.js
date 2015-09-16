var THREE = require('three');
var assert = require('assert-plus');
var _ = require('lodash');

var Component = require('../../core/component');
var InputComponent = require('../../core/components/inputcomponent');

var Grid = require('./gridcontroller');
var ChunkController = require('./chunkcontroller');
var CameraController = require('./cameracontroller');

var InputController = function() {
    Component.call(this);

    this.cube = null;

    this.grid = null;
    this.chunk = null;
    this.gridController = null;
    this.chunkController = null;
    this.cameraController = null;

    this.clickThreshold = 200;
    this.lastMousedownTime = null;
    this.xSpeed = 0.004;
    this.ySpeed = 0.004;

    this.multiMode = false;
    this.isRemove = false;

    this.input = null;
};

InputController.prototype = Object.create(Component.prototype);
InputController.prototype.constructor = InputController;

InputController.prototype.start = function() {
    this.grid = this.getEntityByName('grid');
    this.chunk = this.getEntityByName('chunk');
    this.gridController = this.grid.getComponent(Grid);
    this.chunkController = this.getEntityByName('chunk').getComponent(ChunkController);
    this.input = this.getGame().input;
    this.cameraController = this.getComponent(CameraController);
    this.inputComponent = this.getComponent(InputComponent);

    assert.object(this.grid, 'grid');
    assert.object(this.chunkController, 'chunkController');
    assert.object(this.input, 'input');
    assert.object(this.inputComponent, 'inputComponent');

    this.inputComponent.keydown('up', this.upPressed.bind(this));
    this.inputComponent.keydown('down', this.downPressed.bind(this));
    this.inputComponent.keydown('multiMode', this.multiModePressed.bind(this));
    this.inputComponent.keydown('remove', this.removePressed.bind(this));
    this.inputComponent.keyup('remove', this.removeReleased.bind(this));
    this.inputComponent.mousedown(this.onMousedown.bind(this));
    this.inputComponent.mouseup(this.onMouseup.bind(this));
    this.inputComponent.mousemove(this.onMousemove.bind(this));
};

InputController.prototype.upPressed = function() {
    this.gridController.gridY += 1;
    this.gridController.updateCollisionBody();
    this.gridController.updateGrid(this.chunkController.chunk);
};

InputController.prototype.downPressed = function() {
    this.gridController.gridY -= 1;
    this.gridController.updateCollisionBody();
    this.gridController.updateGrid(this.chunkController.chunk);
};

InputController.prototype.multiModePressed = function() {
    this.multiMode = !this.multiMode;
};

InputController.prototype.removePressed = function() {
    this.isRemove = true;
};

InputController.prototype.removeReleased = function() {
    this.isRemove = false;
};

InputController.prototype.tick = function() {
    var coord = this.getCoord();
    this.updateHighlight(coord);
};

InputController.prototype.onMousedown = function() {
    this.mousehold = true;
    this.lastMousedownTime = new Date().getTime();
};

InputController.prototype.onMouseup = function() {
    this.mousehold = false;

    if (this.lastMousedownTime != null) {
        var diff = new Date().getTime() - this.lastMousedownTime;

        if (diff < this.clickThreshold) {
            var coord = this.getCoord();

            if (coord != null) {
                if (this.isRemove) {
                    this.chunkController.removeBlock(coord);
                } else {
                    this.chunkController.addBlock(coord);
                    this.gridController.updateGrid(this.chunkController.chunk);
                }
            }
        }
    }
};

InputController.prototype.onMousemove = function(e) {
    var coord = this.getCoord();

    if (coord != null && this.multiMode && this.mousehold) {
        if (this.isRemove) {
            this.chunkController.removeBlock(coord);
        } else {
            this.chunkController.addBlock(coord);
        }
    }

    if (!this.multiMode) {
        this.cameraController.rotateCamera({
            x: e.dragX * this.xSpeed,
            y: e.dragY * this.ySpeed
        });
    }
};

//update high light cube, returns coord of high light, return null if no mouse overs
InputController.prototype.updateHighlight = function(coord) {
    if (coord == null) {
        return;
    }

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

    var gridSize = this.gridController.gridSize;
    this.cube.position.x = coord.x * gridSize;
    this.cube.position.y = coord.y * gridSize;
    this.cube.position.z = coord.z * gridSize;
};

InputController.prototype.getCoord = function() {
    if (this.multiMode) {
        return this.getGridCoord();
    }

    return this.getChunkCoord() || this.getGridCoord();
};

InputController.prototype.getGridCoord = function() {
    var collisions = this.getGame().getMouseCollisions();

    var self = this;
    var gridCollision = _.find(collisions, function(collision) {
        return collision.entity == self.grid;
    });

    if (gridCollision == null) {
        return null;
    }

    var intersect = gridCollision.intersect;
    var gridSize = this.gridController.gridSize;
    var halfGridSize = gridSize / 2.0;

    return {
        x: Math.floor((intersect.point.x + halfGridSize) / gridSize),
        y: this.gridController.gridY,
        z: Math.floor((intersect.point.z + halfGridSize) / gridSize)
    };
};

InputController.prototype.getChunkCoord = function() {
    var collisions = this.getGame().getMouseCollisions();

    var chunkCollision = _.find(collisions, function(collision) {
        return collision.entity == self.chunk;
    });

    if (chunkCollision == null) {
        return null;
    }

    var intersect = chunkCollision.intersect;

    var faceIndex = intersect.faceIndex;
    var faceData = this.chunkController.faceMap[faceIndex];

    var coord = _.cloneDeep(faceData.coord);

    if (this.isRemove) {
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
};

module.exports = InputController;
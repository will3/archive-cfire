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

    this.isRemove = false;

    this.input = null;

    this.axis = [];
    this.inputText = '';

    this.scale = new THREE.Vector3(1, 1, 1);

    this.lastX = null;
    this.lastY = null;
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
    this.inputComponent.keydown('remove', this.removePressed.bind(this));
    this.inputComponent.keyup('remove', this.removeReleased.bind(this));
    this.inputComponent.keydown('grid', this.gridPressed.bind(this));
    this.inputComponent.keydown(['x', 'y', 'z'], function(key) {
        this.setAxis(key);
    }.bind(this));
    this.inputComponent.keydown(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-'], function(key) {
        this.appendInput(key);
    }.bind(this));
    this.inputComponent.keydown('enter', this.enterInput.bind(this));

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

InputController.prototype.removePressed = function() {
    this.isRemove = true;
};

InputController.prototype.removeReleased = function() {
    this.isRemove = false;
};

InputController.prototype.gridPressed = function() {
    this.gridController.gridHidden = !this.gridController.gridHidden;
};

InputController.prototype.setAxis = function(axis) {
    if (!_.includes(this.axis, axis)) {
        this.axis.push(axis);
    }
    this.inputText = '';
};

InputController.prototype.appendInput = function(key) {
    this.inputText += key;
    this.processAxis();
};

InputController.prototype.enterInput = function() {
    this.processAxis();
    this.inputText = '';
    this.axis = [];
};

InputController.prototype.processAxis = function() {
    if (_.includes(this.axis, 'x')) {
        this.scale.x = this.getInputNum(1.0);
    }
    if (_.includes(this.axis, 'y')) {
        this.scale.y = this.getInputNum(1.0);
    }
    if (_.includes(this.axis, 'z')) {
        this.scale.z = this.getInputNum(1.0);
    }
};

InputController.prototype.getInputNum = function(defaultValue) {
    defaultValue = defaultValue || 0.0;
    if (this.inputText == null || this.inputText.length == 0) {
        return defaultValue;
    }

    var num = parseFloat(this.inputText);
    if (num == NaN) {
        return defaultValue;
    }

    return num;
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
            this.onMouseClick();
        }
    }
};

InputController.prototype.onMouseClick = function() {
    var coord = this.getCoord();

    if (coord == null) {
        return;
    }

    if (this.isRemove) {
        this.chunkController.removeBlock(coord);
    } else {
        this.chunkController.addBlock(coord, {
            scale: {
                x: this.scale.x,
                y: this.scale.y,
                z: this.scale.z
            },
            color: this.color
        });
        this.gridController.updateGrid(this.chunkController.chunk);
    }
};

InputController.prototype.onMousemove = function(e) {
    if (this.lastX != null && this.lastY != null) {
        if (this.mousehold) {
            var dragX = e.x - this.lastX;
            var dragY = e.y - this.lastY;

            this.onMouseDrag(dragX, dragY);
        }
    }

    this.lastX = e.x;
    this.lastY = e.y;
};

InputController.prototype.onMouseDrag = function(dragX, dragY) {
    this.cameraController.rotateCamera({
        x: dragX * this.xSpeed,
        y: dragY * this.ySpeed
    });
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

    this.cube.scale.copy(this.scale);
};

InputController.prototype.getCoord = function() {
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
        x: Math.round((intersect.point.x) / gridSize),
        y: this.gridController.gridY,
        z: Math.round((intersect.point.z) / gridSize)
    };
};

InputController.prototype.getChunkCoord = function() {
    var collisions = this.getGame().getMouseCollisions();

    var self = this;
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
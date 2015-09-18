var THREE = require('three');
var assert = require('assert-plus');
var _ = require('lodash');

var Component = require('../../core/component');
var InputComponent = require('../../core/components/inputcomponent');

var Grid = require('./gridcontroller');
var ChunkController = require('./chunkcontroller');
var CameraController = require('./cameracontroller');
var PointerController = require('./pointercontroller');

var AddBlock = require('./commands/addblock');

var InputController = function() {
    Component.call(this);

    this.grid = null;
    this.chunk = null;
    this.gridController = null;
    this.chunkController = null;
    this.cameraController = null;
    this.pointerController = null;

    this.clickThreshold = 200;
    this.lastMousedownTime = null;
    this.xSpeed = 0.004;
    this.ySpeed = 0.004;

    this.isRemove = false;

    this.inputText = '';

    this.lastX = null;
    this.lastY = null;

    this.hasFocus = true;

    this.commands = [];

    this.redoCommands = [];
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
    this.pointerController = this.getEntityByName('pointer').getComponent(PointerController);

    assert.object(this.grid, 'grid');
    assert.object(this.chunkController, 'chunkController');
    assert.object(this.input, 'input');
    assert.object(this.inputComponent, 'inputComponent');
    assert.object(this.pointerController, 'pointerController');

    this.inputComponent.keydown('up', this.moveGridUp.bind(this));
    this.inputComponent.keydown('down', this.moveGridDown.bind(this));
    this.inputComponent.keydown('remove', this.removePressed.bind(this));
    this.inputComponent.keyup('remove', this.removeReleased.bind(this));
    this.inputComponent.keydown('grid', this.gridPressed.bind(this));
    this.inputComponent.keydown(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-'], function(key) {
        this.appendInput(key);
    }.bind(this));
    this.inputComponent.keydown('enter', this.enterInput.bind(this));
    this.inputComponent.keydown('undo', this.undo.bind(this));
    this.inputComponent.keydown('redo', this.redo.bind(this));
    this.inputComponent.keydown('save', this.save.bind(this));

    this.inputComponent.mousedown(this.onMousedown.bind(this));
    this.inputComponent.mouseup(this.onMouseup.bind(this));
    this.inputComponent.mousemove(this.onMousemove.bind(this));
};

InputController.prototype.moveGridUp = function() {
    this.gridController.gridY += 1;
    this.gridController.updateCollisionBody();
    this.gridController.updateGrid(this.chunkController.chunk);
};

InputController.prototype.moveGridDown = function() {
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

InputController.prototype.appendInput = function(key) {
    this.inputText += key;
};

InputController.prototype.enterInput = function() {
    this.inputText = '';
    //process input
};

InputController.prototype.tick = function() {
    var coord = this.getCoord();

    if (coord == null) {
        this.pointerController.setVisible(false);
    } else {
        this.pointerController.setVisible(true);
        this.pointerController.setCoord(coord);
    }
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
    if (!this.hasFocus) {
        return;
    }

    var coord = this.getCoord();

    if (coord == null) {
        return;
    }

    if (this.isRemove) {
        this.chunkController.removeBlock(coord);
    } else {
        var command = new AddBlock({
            chunkController: this.chunkController,
            coord: coord,
            block: this.getBlock()
        });

        this.runCommand(command);

        this.gridController.updateGrid(this.chunkController.chunk);
    }
};

InputController.prototype.getBlock = function() {
    return {
        scale: {
            x: this.pointerController.transform.scale.x,
            y: this.pointerController.transform.scale.y,
            z: this.pointerController.transform.scale.z,
        },
        color: this.color
    };
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

InputController.prototype.runCommand = function(command) {
    command.run();
    this.commands.push(command);
    this.redoCommands = [];
};

InputController.prototype.undo = function() {
    if (this.commands.length == 0) {
        return;
    }

    var lastCommand = this.commands[this.commands.length - 1];
    lastCommand.undo();
    _.pull(this.commands, lastCommand);
    this.redoCommands.push(lastCommand);
};

InputController.prototype.redo = function() {
    if (this.redoCommands.length == 0) {
        return;
    }

    var lastCommand = this.redoCommands[this.redoCommands.length - 1];
    lastCommand.run();
    _.pull(this.redoCommands, lastCommand);
    this.commands.push(lastCommand);
};

InputController.prototype.save = function() {
    var fileName = prompt("choose file name:", "block.cf");

    if (fileName != null) {
        var json = this.chunkController.serialize();
        var blob = new Blob([JSON.stringify(json)], {
            type: "text/plain;charset=utf-8"
        });
        require('filesaver.js').saveAs(blob, fileName);
    }
};

InputController.prototype.openFile = function(file) {
    var reader = new FileReader();
    var self = this;
    reader.addEventListener("loadend", function() {
        // reader.result contains the contents of blob as a typed array
        var json = JSON.parse(reader.result);
        self.chunkController.load(json);
    });
    reader.readAsText(file);
};

InputController.prototype.reset = function() {
    this.chunkController.reset();
    this.commands = [];
    this.redoCommands = [];
};

InputController.prototype.setBlockX = function(value) {
    this.pointerController.transform.scale.x = value;
};

InputController.prototype.setBlockY = function(value) {
    this.pointerController.transform.scale.y = value;
};

InputController.prototype.setBlockZ = function(value) {
    this.pointerController.transform.scale.z = value;
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
var Component = require('../core/component');
var getInput = require('../core/macros/getinput');

var MoveCameraWithMouse = function() {
    Component.call(this);
};

MoveCameraWithMouse.prototype = Object.create(Component.prototype);
MoveCameraWithMouse.prototype.constructor = MoveCameraWithMouse;

MoveCameraWithMouse.prototype.tick = function(elapsedTime) {
    var dragX = getInput().mouseDragX;
    var dragY = getInput().mouseDragY;
};

module.exports = MoveCameraWithMouse;
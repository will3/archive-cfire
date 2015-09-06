var Component = require('../core/component');

var MoveCameraWithMouse = function() {
    Component.call(this);
};

MoveCameraWithMouse.prototype = Object.create(Component.prototype);
MoveCameraWithMouse.prototype.constructor = MoveCameraWithMouse;

MoveCameraWithMouse.prototype.tick = function(elapsedTime) {
	
};

module.exports = MoveCameraWithMouse;
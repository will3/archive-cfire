var Component = require('../core/component');

var MoveCameraWithMouse = function() {
    Component.call(this);

    this.xSpeed = 0.001;
    this.ySpeed = 0.001;
};

MoveCameraWithMouse.prototype = Object.create(Component.prototype);
MoveCameraWithMouse.prototype.constructor = MoveCameraWithMouse;

MoveCameraWithMouse.prototype.tick = function(elapsedTime) {
    var game = this.getGame();
    var dragX = game.input.mouseDragX;
    var dragY = game.input.mouseDragY;

    game.camera.rotation.y += dragX * this.xSpeed;
    game.camera.rotation.x += dragY * this.ySpeed;
};

module.exports = MoveCameraWithMouse;
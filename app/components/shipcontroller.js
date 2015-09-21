var Engine = require('../../core/engine');
var Component = Engine.Component;

var ShipController = function() {
    Component.call(this);
};

ShipController.prototype = Object.create(Component.prototype);
ShipController.prototype.constructor = ShipController;

module.exports = ShipController;
var assert = require('assert-plus');

var Engine = require('../../core/engine');
var Component = Engine.Component;

var InputController = function() {
    Component.call(this);

};

InputController.prototype = Object.create(Component.prototype);
InputController.prototype.constructor = Component;

InputController.prototype.start = function(){


};

module.exports = InputController;
var Component = require('../../core/component');
var THREE = require('three');

var HighlightSelection = function() {
    Component.call(this);
};

HighlightSelection.prototype = Object.create(Component.prototype);
HighlightSelection.prototype.constructor = HighlightSelection;

HighlightSelection.prototype.tick = function() {
	
};

HighlightSelection.prototype.afterTick = function() {
	
};

module.exports = HighlightSelection;
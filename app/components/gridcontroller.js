var THREE = require('three');
var _ = require('lodash');
var assert = require('assert-plus');

var Component = require('../../core/component');
var RenderComponent = require('../../core/components/rendercomponent');
var CollisionBody = require('../../core/components/collisionbody');
var plane = require('./utils/plane');

//makes grid render and collision objects
var GridController = function() {
    Component.call(this);

    this.gridNum = 10;
    this.gridSize = 50;
    this.gridY = 0;

    this.renderComponent = null;
    this.collisionBody = null;
};

GridController.prototype = Object.create(Component.prototype);
GridController.prototype.constructor = GridController;

GridController.prototype.start = function() {
    this.renderComponent = this.getComponent(RenderComponent);
    this.collisionBody = this.getComponent(CollisionBody);

    assert.object(this.renderComponent, 'renderComponent');
    assert.object(this.collisionBody, 'collisionBody');

    this.updateCollisionBody();
};

GridController.prototype.updateGrid = function(chunk) {
    var object = require('./utils/getchunkgrid')(chunk, this.gridY, this.gridSize);
    this.renderComponent.object = object;
};

GridController.prototype.updateCollisionBody = function() {
    var largeNumber = 99999;
    this.collisionBody.object = plane(largeNumber, this.getY());
};

GridController.prototype.getY = function() {
    return this.gridY * this.gridSize - this.gridSize / 2.0;
};

module.exports = GridController;
var assert = require('assert-plus');
var Engine = require('../../core/engine');
var Component = Engine.Component;
var deserialize = Engine.Block.deserialize;
var mesh = Engine.Block.mesh;

var frigate = require('../resources/models/frigate.json');

var BlockModel = function() {
    Component.call(this);

    this.modelName = null;

    this.renderComponent = null;
};

BlockModel.prototype = Object.create(Component.prototype);
BlockModel.prototype.constructor = BlockModel;

BlockModel.prototype.start = function() {
    this.renderComponent = this.getComponent('RenderComponent');
    assert.object(this.renderComponent, 'renderComponent');

    var object = null;
    switch (this.modelName) {
        case 'frigate':
            {
                object = mesh(deserialize(frigate));
                break;
            }
    }

    this.renderComponent.object = object;
};

module.exports = BlockModel;
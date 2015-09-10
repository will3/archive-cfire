var Component = require('../component');
var THREE = require('three');

var RenderComponent = function() {
    Component.call(this);

    //sets render object
    //defaults to empty object 3d
    this.object = null;

    //wether to perform a redraw in the next frame
    //used by renderer
    this.needsRedraw = false;
};

RenderComponent.prototype = Object.create(Component.prototype);
RenderComponent.prototype.constructor = RenderComponent;

module.exports = RenderComponent;
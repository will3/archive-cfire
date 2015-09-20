var Component = require('../component');
var THREE = require('three');

var RenderComponent = function() {
    Component.call(this);

    //sets render object
    //defaults to empty object 3d
    this._object = null;

    //wether to perform a redraw in the next frame
    //used by renderer
    this.needsUpdate = false;

    //visible
    this.visible = true;

    //has edges
    this.hasEdges = false;

    this.adddedToScene = false;
};

RenderComponent.prototype = Object.create(Component.prototype);
RenderComponent.prototype.constructor = RenderComponent;

Object.defineProperty(RenderComponent.prototype, 'object', {
    get: function() {
        return this._object;
    },

    set: function(value) {
        this._object = value;
        this.needsUpdate = true;
    }
});

module.exports = RenderComponent;
var Component = require('../component');
var THREE = require('three');

var RenderComponent = function() {
    Component.call(this);

    //object 3d this render component holds
    //initialize to empty object
    this.object = new THREE.Object3D();

    //wether this component has been added to scene,
    //used by renderer
    this.addedToScene = false;

    //wether to perform a redraw in the next frame
    //used by renderer
    this.needsRedraw = false;
};

RenderComponent.prototype = Object.create(Component.prototype);
RenderComponent.prototype.constructor = RenderComponent;

module.exports = RenderComponent;
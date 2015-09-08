var THREE = require('three');

var Component = require('../../core/component');
var RenderComponent = require('../../core/components/rendercomponent');

var MakeGrid = function() {
    Component.call(this);

    this.madeGrid = false;
};

MakeGrid.prototype = Object.create(Component.prototype);
MakeGrid.prototype.constructor = MakeGrid;

MakeGrid.prototype.tick = function() {
    if (this.madeGrid) {
        return;
    }

    var renderComponent = this.getComponent(RenderComponent);

    var material = new THREE.LineBasicMaterial({
        color: 0xff0000
    });
    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(-100, 0, 0), new THREE.Vector3(0, 100, 0), new THREE.Vector3(100, 0, 0));
    var line = new THREE.Line(geometry, material);

    renderComponent.object.add(line);

    this.madeGrid = true;
};

module.exports = MakeGrid;
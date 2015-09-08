var THREE = require('three');
var _ = require('lodash');

var Component = require('../../core/component');
var RenderComponent = require('../../core/components/rendercomponent');

var MakeGrid = function() {
    Component.call(this);

    this.madeGrid = false;

    this.size = 1000;

    this.gridSize = 100;
};

MakeGrid.prototype = Object.create(Component.prototype);
MakeGrid.prototype.constructor = MakeGrid;

MakeGrid.prototype.tick = function() {
    if (this.madeGrid) {
        return;
    }

    var renderComponent = this.getComponent(RenderComponent);

    var material = new THREE.LineBasicMaterial({
        color: 0xAAAAAA
    });

    var geometries = [];
    for (var z = -this.size / 2.0; z <= this.size / 2.0; z += this.gridSize) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-this.size / 2.0, 0, z), new THREE.Vector3(this.size / 2.0, 0, z));
        geometries.push(geometry);
    }

    for (var x = -this.size / 2.0; x <= this.size / 2.0; x += this.gridSize) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(x, 0, -this.size / 2.0), new THREE.Vector3(x, 0, this.size / 2.0));
        geometries.push(geometry);
    }

    var lines = _.map(geometries, function(geometry) {
        return new THREE.Line(geometry, material);
    });

    lines.forEach(function(line) {
        renderComponent.object.add(line);
    });

    this.madeGrid = true;
};

module.exports = MakeGrid;
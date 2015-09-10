var THREE = require('three');
var _ = require('lodash');
var assert = require('assert-plus');

var Component = require('../../core/component');
var RenderComponent = require('../../core/components/rendercomponent');
var CollisionBody = require('../../core/components/collisionbody');

//makes grid render and collision objects
var Grid = function() {
    Component.call(this);

    this.gridNum = 10;
    this.gridSize = 50;
    this.gridY = 0;

    this.renderComponent = null;
    this.collisionBody = null;
};

Grid.prototype = Object.create(Component.prototype);
Grid.prototype.constructor = Grid;

Grid.prototype.start = function() {
    this.renderComponent = this.getComponent(RenderComponent);
    this.collisionBody = this.getComponent(CollisionBody);

    assert.object(this.renderComponent, 'renderComponent');
    assert.object(this.collisionBody, 'collisionBody');

    this.updateObjects();
};

Grid.prototype.updateObjects = function() {
    this.makeLines();
    this.makeCollisionBody();
};

Grid.prototype.makeLines = function() {
    var material = new THREE.LineBasicMaterial({
        color: 0xAAAAAA
    });

    var geometries = [];
    var size = this.gridSize * (this.gridNum * 2 + 1);
    var y = this.getY();

    for (var z = -size / 2.0; z <= size / 2.0; z += this.gridSize) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(-size / 2.0, y, z), new THREE.Vector3(size / 2.0, y, z));
        geometries.push(geometry);
    }

    for (var x = -size / 2.0; x <= size / 2.0; x += this.gridSize) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(x, y, -size / 2.0), new THREE.Vector3(x, y, size / 2.0));
        geometries.push(geometry);
    }

    var lines = _.map(geometries, function(geometry) {
        return new THREE.Line(geometry, material);
    });

    var self = this;

    var object = new THREE.Object3D();
    lines.forEach(function(line) {
        object.add(line);
    });

    this.renderComponent.object = object;
};

Grid.prototype.makeCollisionBody = function() {
    var size = this.gridSize * this.gridNum * 2;
    var y = this.getY();
    //  d  c
    //a  b
    var a = new THREE.Vector3(-size / 2.0, y, -size / 2.0);
    var b = new THREE.Vector3(size / 2.0, y, -size / 2.0);
    var c = new THREE.Vector3(size / 2.0, y, size / 2.0);
    var d = new THREE.Vector3(-size / 2.0, y, size / 2.0);

    var geometry = new THREE.Geometry();
    geometry.vertices.push(a, b, c, d);
    geometry.faces.push(new THREE.Face3(0, 2, 1), new THREE.Face3(0, 3, 2));
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });

    this.collisionBody.object = new THREE.Mesh(geometry, material);
};

Grid.prototype.getY = function() {
    return this.gridY * this.gridSize - this.gridSize / 2.0;
};
module.exports = Grid;
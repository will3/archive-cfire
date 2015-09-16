var _ = require('lodash');
var THREE = require('three');

//given y, return list of x bounds by z and list of z bounds by x
var getChunkGrid = function(chunk, gridY, gridSize) {

    //get cross section
    var coords = [];
    var xLines = [];
    chunk.visit(function(x, y, z, block) {
        if (y != gridY) {
            return;
        }
    });

    var overGrid = 1;
    var overDraw = 1;
    var minX = -9.5;
    var maxX = 9.5;
    var minZ = -9.5;
    var maxZ = 9.5;

    var object = new THREE.Object3D();
    var material = new THREE.LineBasicMaterial({
        color: 0xAAAAAA
    });

    var y = gridY - 0.5;
    for (var x = minX; x <= maxX; x++) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(x, y, minZ - overDraw).multiplyScalar(gridSize), new THREE.Vector3(x, y, maxZ + overDraw).multiplyScalar(gridSize));
        object.add(new THREE.Line(geometry, material));
    }

    for (var z = minZ; z <= maxZ; z++) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(minX - overDraw, y, z).multiplyScalar(gridSize), new THREE.Vector3(maxX + overDraw, y, z).multiplyScalar(gridSize));
        object.add(new THREE.Line(geometry, material));
    }

    return object;
}

module.exports = getChunkGrid;
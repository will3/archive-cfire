var THREE = require('three');
var _ = require('lodash');

var defaultMesher = {
    getVertice: function(index) {
        switch (index) {
            case 0:
                return new THREE.Vector3(-0.5, -0.5, -0.5); //0
            case 1:
                return new THREE.Vector3(+0.5, -0.5, -0.5); //1
            case 2:
                return new THREE.Vector3(+0.5, -0.5, +0.5); //2
            case 3:
                return new THREE.Vector3(-0.5, -0.5, +0.5); //3
            case 4:
                return new THREE.Vector3(-0.5, +0.5, -0.5); //4
            case 5:
                return new THREE.Vector3(+0.5, +0.5, -0.5); //5
            case 6:
                return new THREE.Vector3(+0.5, +0.5, +0.5); //6
            case 7:
                return new THREE.Vector3(-0.5, +0.5, +0.5); //7

            default:
                throw "invalid index";
        }
    },

    //    7   6
    //  4   5
    //    3   2
    //  0   1
    getVertices: function(side) {
        var indices;
        switch (side) {
            case 'left':
                indices = [7, 4, 0, 3];
                break;
            case 'right':
                indices = [5, 6, 2, 1];
                break;
            case 'bottom':
                indices = [0, 1, 2, 3];
                break;
            case 'top':
                indices = [5, 4, 7, 6];
                break;
            case 'back':
                indices = [1, 0, 4, 5];
                break;
            case 'front':
                indices = [6, 7, 3, 2];
                break;
            default:
                return;
        }

        return _.map(indices, function(indice) {
            return this.getVertice(indice);
        }.bind(this));
    }
}

var addFace = function(side, params) {
    params = params || {};

    var mesher = params.mesher;
    var coord = params.coord || new THREE.Vector3();
    var gridSize = params.gridSize || new THREE.Vector3(1, 1, 1);
    var geometry = params.geometry;
    var faceMap = params.faceMap;
    var gap = params.gap;

    var vertices = _.map(mesher.getVertices(side), function(vertice) {
        return vertice.multiplyScalar(1 - gap).add(coord).multiplyScalar(gridSize);
    });

    var indexOffset = geometry.vertices.length;
    geometry.vertices.push.apply(geometry.vertices, vertices);

    var faces = [
        new THREE.Face3(indexOffset + 0, indexOffset + 1, indexOffset + 2),
        new THREE.Face3(indexOffset + 2, indexOffset + 3, indexOffset + 0)
    ]

    faces.forEach(function(face) {
        geometry.faces.push(face);
        if (faceMap != null) {
            faceMap[geometry.faces.length - 1] = {
                coord: coord,
                side: side,
                face: face
            }
        }
    });
}

//params
//meshers   dictionary of meshers, if empty a default mesher will be used
//gridSize  grid size to use
//faceMap   if not empty, populate this instance with face mapping info
module.exports = function(chunk, params) {
    params = params || {};
    var meshers = params.meshers || {};
    var gridSize = params.gridSize || 10;
    var gap = params.gap || 0.0;

    var geometry = new THREE.Geometry();

    chunk.visit(function(x, y, z, obj) {
        var left = chunk.get(x - 1, y, z);
        var right = chunk.get(x + 1, y, z);
        var bottom = chunk.get(x, y - 1, z);
        var top = chunk.get(x, y + 1, z);
        var back = chunk.get(x, y, z - 1);
        var front = chunk.get(x, y, z + 1);

        var mesher = defaultMesher;

        var coord = {
            x: x,
            y: y,
            z: z
        };

        var mesherParams = {
            coord: coord,
            geometry: geometry,
            gridSize: gridSize,
            faceMap: params.faceMap,
            mesher: mesher,
            gap: gap
        };

        if (!left) {
            addFace('left', mesherParams);
        }

        if (!right) {
            addFace('right', mesherParams);
        }

        if (!bottom) {
            addFace('bottom', mesherParams);
        }

        if (!top) {
            addFace('top', mesherParams);
        }

        if (!back) {
            addFace('back', mesherParams);
        }

        if (!front) {
            addFace('front', mesherParams);
        }
    });

    geometry.mergeVertices();
    geometry.computeFaceNormals();

    return geometry;
};
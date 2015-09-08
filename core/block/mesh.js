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
    addFace: function(face, coord, obj, geometry, scale) {
        var indices;
        switch (face) {
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
                throw "invalid face " + face;
        }

        var self = this;
        var vertices = _.map(indices, function(indice) {
            return self.getVertice(indice).add(coord).multiplyScalar(scale);
        });

        var indexOffset = geometry.vertices.length;
        geometry.vertices.push.apply(geometry.vertices, vertices);
        geometry.faces.push(new THREE.Face3(indexOffset + 0, indexOffset + 1, indexOffset + 2));
        geometry.faces.push(new THREE.Face3(indexOffset + 2, indexOffset + 3, indexOffset + 0));
    }
};

module.exports = function(chunk, params) {
    params = params || {};
    var meshers = params.meshers || {};
    var gridSize = params.gridSize || 10;

    var geometry = new THREE.Geometry();

    chunk.visit(function(x, y, z, obj) {
        var left = chunk.get(x - 1, y, z);
        var right = chunk.get(x + 1, y, z);
        var bottom = chunk.get(x, y - 1, z);
        var top = chunk.get(x, y + 1, z);
        var back = chunk.get(x, y, z - 1);
        var front = chunk.get(x, y, z + 1);

        var type = obj.type;
        var mesher = meshers[type] || defaultMesher;

        var coord = {
            x: x,
            y: y,
            z: z
        };

        if (!left) {
            mesher.addFace('left', coord, obj, geometry, gridSize);
        }

        if (!right) {
            mesher.addFace('right', coord, obj, geometry, gridSize);
        }

        if (!bottom) {
            mesher.addFace('bottom', coord, obj, geometry, gridSize);
        }

        if (!top) {
            mesher.addFace('top', coord, obj, geometry, gridSize);
        }

        if (!back) {
            mesher.addFace('back', coord, obj, geometry, gridSize);
        }

        if (!front) {
            mesher.addFace('front', coord, obj, geometry, gridSize);
        }
    });

    geometry.mergeVertices();

    return geometry;
};
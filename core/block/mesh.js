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
    var edges = params.edges;
    var gap = params.gap;
    var block = params.block || {};
    var blockScale = block.scale || {
        x: 1,
        y: 1,
        z: 1
    };
    var materialIndex = params.materialIndex;

    var vertices = _.map(mesher.getVertices(side), function(vertice) {
        return vertice
            .applyMatrix4(new THREE.Matrix4().makeScale(blockScale.x, blockScale.y, blockScale.z))
            .multiplyScalar(1 - gap)
            .add(coord)
            .multiplyScalar(gridSize);
    });

    var indexOffset = geometry.vertices.length;
    geometry.vertices.push.apply(geometry.vertices, vertices);

    var faces = [
        new THREE.Face3(indexOffset + 0, indexOffset + 1, indexOffset + 2),
        new THREE.Face3(indexOffset + 2, indexOffset + 3, indexOffset + 0)
    ]

    faces.forEach(function(face) {
        face.materialIndex = materialIndex;
        geometry.faces.push(face);
        if (faceMap != null) {
            faceMap[geometry.faces.length - 1] = {
                coord: coord,
                side: side,
                face: face
            }
        }
    });

    if (edges != null) {
        edges.push(new THREE.Line3(vertices[0], vertices[1]));
        edges.push(new THREE.Line3(vertices[1], vertices[2]));
        edges.push(new THREE.Line3(vertices[2], vertices[3]));
        edges.push(new THREE.Line3(vertices[3], vertices[0]));
    }
}

var hasGap = function(block) {
    if (block.scale == null) {
        return false;
    }

    return block.scale.x != 1 || block.scale.y != 1 || block.scale.z != 1;
};

var mergeEdges = function(edges) {
    var precision = 4;
    var multiple = Math.pow(10, 4);

    var map = {};

    for (var i in edges) {
        var line = edges[i];
        var id = hashVertice(line.start, multiple) + '_' + hashVertice(line.end, multiple);
        map[id] = line;
    }

    return _.values(map);
}

var hashVertice = function(vertice, multiple) {
    var id = Math.round(vertice * multiple) + '_' + Math.round(vertice * multiple) + '_' + Math.round(vertice * multiple);
    return id;
}

//params
//meshers   dictionary of meshers, if empty a default mesher will be used
//gridSize  grid size to use
//faceMap   if not empty, populate this instance with face mapping info
//edges     if not empty, populate this with Line3 array
//ouputGeometry    output THREE.Geometry instead of THREE.BufferGeometry if set to true, defaults to false
module.exports = function(chunk, params) {
    params = params || {};
    var meshers = params.meshers || {};
    var gridSize = params.gridSize || 10;
    var gap = params.gap || 0.0;
    var ouputGeometry = params.ouputGeometry || true;

    var geometry = new THREE.Geometry();

    var materials = [];

    chunk.visit(function(x, y, z, block) {
        var mesher = defaultMesher;

        var coord = {
            x: x,
            y: y,
            z: z
        };

        var color = block.color || 0x000000
        var materialIndex = _.findIndex(materials, function(material) {
            return material.color.getHex() == color;
        });

        if (materialIndex == -1) {
            var material = new THREE.MeshBasicMaterial({
                color: color
            });

            materials.push(material);

            materialIndex = materials.length - 1;
        }

        var mesherParams = {
            coord: coord,
            geometry: geometry,
            gridSize: gridSize,
            faceMap: params.faceMap,
            mesher: mesher,
            gap: gap,
            block: block,
            materialIndex: materialIndex,
            edges: params.edges
        };

        if (hasGap(block)) {
            addFace('left', mesherParams);
            addFace('right', mesherParams);
            addFace('bottom', mesherParams);
            addFace('to', mesherParams);
            addFace('back', mesherParams);
            addFace('front', mesherParams);
        }

        var left = chunk.get(x - 1, y, z);
        var right = chunk.get(x + 1, y, z);
        var bottom = chunk.get(x, y - 1, z);
        var top = chunk.get(x, y + 1, z);
        var back = chunk.get(x, y, z - 1);
        var front = chunk.get(x, y, z + 1);

        if (!left || hasGap(left)) {
            addFace('left', mesherParams);
        }

        if (!right || hasGap(right)) {
            addFace('right', mesherParams);
        }

        if (!bottom || hasGap(bottom)) {
            addFace('bottom', mesherParams);
        }

        if (!top || hasGap(top)) {
            addFace('top', mesherParams);
        }

        if (!back || hasGap(back)) {
            addFace('back', mesherParams);
        }

        if (!front || hasGap(front)) {
            addFace('front', mesherParams);
        }
    });

    //merge vertices and update face indices
    geometry.mergeVertices();
    geometry.computeFaceNormals();

    //merge edges
    params.edges = mergeEdges(params.edges);

    var material = new THREE.MeshFaceMaterial(materials);

    if (!ouputGeometry) {
        geometry = new THREE.BufferGeometry().fromGeometry(geometry);
    }

    var object = new THREE.Mesh(geometry, material);

    return object;
};
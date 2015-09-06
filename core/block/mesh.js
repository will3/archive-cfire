var defaultMesher = function() {
    addLeft: function(x, y, z, obj, geometry) {

    },

    addRight: function(x, y, z, obj, geometry) {

    },

    addBottom: function(x, y, z, obj, geometry) {

    },

    addTop: function(x, y, z, obj, geometry) {

    },

    addBack: function(x, y, z, obj, geometry) {

    },

    addFront: function(x, y, z, obj, geometry) {

    }
}();

module.exports = function(chunk, meshers) {
    meshers = meshers || {};

    var geometry = new THREE.Geometry();
    var object = new THREE.Mesh(geometry);

    chunk.visit(function(x, y, z, obj) {
        var left = chunk.get(x - 1, y, z);
        var right = chunk.get(x + 1, y, z);
        var bottom = chunk.get(x, y - 1, z);
        var top = chunk.get(x, y + 1, z);
        var back = chunk.get(x, y, z - 1);
        var front = chunk.get(x, y, z + 1);

        var type = obj.type;
        var mesher = meshers[type] || defaultMesher;

        if (!left) {
            mesher.addLeft(x, y, z, obj, geometry);
        }

        if (!right) {
            mesher.addRight(x, y, z, obj, geometry);
        }

        if (!bottom) {
            mesher.addBottom(x, y, z, obj, geometry);
        }

        if (!top) {
            mesher.addTop(x, y, z, obj, geometry);
        }

        if (!back) {
            mesher.addBack(x, y, z, obj, geometry);
        }

        if (!front) {
            mesher.addFront(x, y, z, obj, geometry);
        }
    });

    return object;
};
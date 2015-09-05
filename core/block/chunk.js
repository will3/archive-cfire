//params
//data	if not empty, populates map with data, defaults to null
var Chunk = function(params) {
    params = params || {};

    this.map = {};

    if (params.data != null) {
        this.populateMap(params.data);
    }
};

Chunk.prototype = {
    constructor: Chunk,

    add: function(x, y, z, obj) {
        if (this.map[x] == null) {
            this.map[x] = {};
        }

        if (this.map[x][y] == null) {
            this.map[x][y] = {};
        }

        this.map[x][y][z] = obj;
    },

    remove: function(x, y, z) {
        if (this.map[x] == null || this.map[x][y] == null) {
            return;
        }

        delete this.map[x][y][z];
    },

    get: function(x, y, z) {
        return this.map[x][y][z];
    },

    //populate map with data
    populateMap: function(data) {
        var blocks = data.blocks;
        var self;
        blocks.forEach(function(block) {
            var coords = block.coord.split(',');
            var x = parseInt(coords[0]);
            var y = parseInt(coords[1]);
            var z = parseInt(coords[2]);

            self.add(x, y, z, block.obj);
        });
    }
}

module.exports = Chunk;
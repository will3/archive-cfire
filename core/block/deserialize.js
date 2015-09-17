var Chunk = require('./chunk');

module.exports = function(json) {
    var map = json.map;

    var chunk = new Chunk();
    for (var i in map) {
        var item = map[i];
        chunk.add(parseInt(item.x), parseInt(item.y), parseInt(item.z), item.block);
    }

    return chunk;
};
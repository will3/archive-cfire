var Chunk = require('./chunk');

module.exports = function(json) {
    var chunk = new Chunk();

    var blocks = json[0];

    for (var i in json) {
        if (i == 0) {
            continue;
        }

        var data = json[i];
        var components = data.split(',');
        var x = components[0];
        var y = components[1];
        var z = components[2];
        var index = components[3];
        
        chunk.add(parseInt(x), parseInt(y), parseInt(z), blocks[index]);
    }

    return chunk;
};
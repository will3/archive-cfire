module.exports = function(chunk) {
    var json = {};

    json.map = [];

    chunk.visit(function(x, y, z, block) {
        json.map.push({
            x: x,
            y: y,
            z: z,
            block: block
        });
    });

    return json;
};
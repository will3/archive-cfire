_ = require('lodash');

module.exports = function(chunk) {
    var json = {};

    json.map = [];

    var blocks = [];

    var data = [];
    // _.isEqual
    chunk.visit(function(x, y, z, block) {
        var index = _.findIndex(blocks, function(existing) {
            return _.isEqual(block, existing);
        });

        if (index == -1) {
            blocks.push(block);
            index = blocks.length - 1;
        }

        data.push([x, y, z, index].join(','));
    });

    data.unshift(blocks);

    return data;
};
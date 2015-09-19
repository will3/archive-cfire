var extend = require('extend');
var _ = require('lodash');

var RemoveBlock = function(params) {
    this.chunkController = null;
    this.coord = null;

    this.block = null;

    extend(this, params);
};

RemoveBlock.prototype = {
    constructor: RemoveBlock,

    run: function() {
        this.block = _.cloneDeep(this.chunkController.removeBlock(this.coord));
    },

    undo: function() {
        if (this.block == null) {
            throw "can't undo";
        }

        this.chunkController.addBlock(this.coord, this.block);
    }
}

module.exports = RemoveBlock;
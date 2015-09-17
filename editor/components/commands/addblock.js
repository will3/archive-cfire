var extend = require('extend');

var AddBlock = function(params) {
    this.chunkController = null;
    this.coord = null;
    this.block = null;

    extend(this, params);
};

AddBlock.prototype = {

    constructor: AddBlock,

    run: function() {
        this.chunkController.addBlock(this.coord, this.block);
    },

    undo: function() {
        this.chunkController.removeBlock(this.coord);
    }

};

module.exports = AddBlock;
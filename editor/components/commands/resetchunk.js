var extend = require('extend');

var ResetChunk = function(params) {
    this.chunk = null;
    this.chunkController = null;

    extend(this, params);
};

ResetChunk.prototype = {
    constructor: ResetChunk,

    run: function() {
        this.chunk = this.chunkController.chunk;
        this.chunkController.reset();
    },

    undo: function() {
        this.chunkController.setChunk(this.chunk);
    }
};

module.exports = ResetChunk;
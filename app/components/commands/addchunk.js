var extend = require('extend');

var AddChunk = function(params) {
    this.chunkController = null;
    this.startCoord = null;
    this.endCoord = null;
    this.block = null;

    extend(this.params);
};

AddChunk.prototype = {
    constructor: AddChunk,

    run: function() {

    },

    undo: function() {

    }
};

module.exports = AddChunk;
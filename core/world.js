var _ = require('lodash');

//game tree
var World = function() {
    this.entities = [];
};

World.prototype = {
    constructor: World,

    addEntity: function(entity) {
        this.entities.push(entity);
    },

    removeEntity: function(entity) {
    	_.pull(this.entities, entity);
    }
}

module.exports = World;
var uuid = require('uuid-v4');

var emptyFunc = function() {};

var Component = function() {
    this.id = uuid();
};

Component.prototype = {
    constructor: Component,

    tick: emptyFunc,

    afterTick: emptyFunc,

    getHasTick: function() {
        return this.tick != emptyFunc;
    },

    getAfterTick: function() {
        return this.afterTick != emptyFunc;
    }
};

module.exports = Component;
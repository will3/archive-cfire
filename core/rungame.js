var extend = require('extend');

var Game = require('./game');

module.exports = function(params) {
    params = params || {};
    var tickRate = params.tickRate || 60.0;
    var scenario = params.scenario;
    var types = params.types || {};
    var keyMap = params.keyMap || keyMap;

    var frameInterval = 1000.0 / tickRate;

    extend(require('./macros/types'), types);

    var game = new Game({
        keyMap: keyMap
    });

    game.start();

    if (scenario != null) {
        game.load(scenario);
    }

    var interval = function() {
        game.tick(frameInterval);
        game.afterTick();
        setTimeout(interval, frameInterval);
    }

    interval();
};
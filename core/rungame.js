module.exports = function(game, params) {
    params = params || {};
    var tickRate = params.tickRate || 60.0;

    var frameInterval = 1000.0 / tickRate;

    var interval = function() {
        game.tick(frameInterval);
        game.afterTick();
        setTimeout(interval, frameInterval);
    }

    interval();
};
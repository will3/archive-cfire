module.exports = function(game, params) {
    params = params || {};
    var frameRate = params.frameRate || 24.0;

    var frameInterval = 1000.0 / frameRate;

    var interval = function() {
        game.tick(frameInterval);
        game.afterTick();
        setTimeout(interval, frameInterval);
    }

    interval();
};
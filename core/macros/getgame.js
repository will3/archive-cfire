var game = null;

module.exports = function() {
    return game;
};

module.exports.register = function(value) {
    game = value;
}
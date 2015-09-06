var input = null;

module.exports = function() {
    return input;
};

module.exports.register = function(value) {
    input = value;
};
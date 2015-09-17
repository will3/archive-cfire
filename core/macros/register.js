var types = require('./types');

module.exports = function(name, type) {
    if (type != null) {
        types[name] = type;
    }
};
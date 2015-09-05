var uuid = require('uuid-v4');

var Component = function(){
	this.id = uuid();
};

Component.prototype = {
	constructor: Component
};

module.exports = Component;
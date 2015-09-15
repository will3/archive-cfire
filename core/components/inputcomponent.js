var Component = require('../component');

var InputComponent = function() {
    Component.call(this);

    //list of bindings
    this.bindings = [];

    this.mousemoveFunc = [];
    this.mousedownFunc = [];
    this.mouseupFunc = [];
};

InputComponent.prototype = Object.create(Component.prototype);
InputComponent.prototype.constructor = InputComponent;

InputComponent.prototype.bind = function(event, type, func) {
    this.bindings.push({
        type: type,
        event: event,
        func: func
    });
};

InputComponent.prototype.keydown = function(event, func) {
    this.bind(event, 'keydown', func);
};

InputComponent.prototype.keyup = function(event, func) {
    this.bind(event, 'keyup', func);
};

InputComponent.prototype.mousemove = function(func) {
    this.mousemoveFunc.push(func);
};

InputComponent.prototype.mousedown = function(func) {
    this.mousedownFunc.push(func);
};

InputComponent.prototype.mouseup = function(func) {
    this.mouseupFunc.push(func);
};

module.exports = InputComponent;

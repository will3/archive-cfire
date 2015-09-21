var $ = require('jquery');
var _ = require('lodash');
try {
    var MouseTrap = require('mousetrap');
} catch (err) {
    console.log('failed to load MouseTrap');
}

var System = require('../system');
var InputState = require('../inputstate');

//params
//inputState    inputState to manage, this instance is assigned to this.inputState, by default create default instance
var InputManager = function(params) {
    System.call(this);

    this.mouseLastX = null;
    this.mouseLastY = null;
    this.mouseLastDragX = null;
    this.mouseLastDragY = null;

    params = params || {};

    this.inputState = params.inputState || new InputState();
    this.container = params.container || $('#container');

    var self = this;

    this.bindMouseFunc = params.bindMouseFunc || function() {
        self.container.mousemove(self.handleMousemove.bind(self));
        self.container.mousedown(self.handleMousedown.bind(self));
        self.container.mouseup(self.handleMouseup.bind(self));
        self.container.mouseleave(self.handleMouseleave.bind(self));
    };

    this.componentPredicate = function(component) {
        return component.bindings.length > 0 || component.mousemoveFunc.length > 0 || component.mousedownFunc.length > 0 || component.mouseupFunc.length > 0;
    }

    this.keyMap = null;

    this.componentMap = {};
};

InputManager.prototype = Object.create(System.prototype);
InputManager.prototype.constructor = InputManager;

InputManager.prototype.start = function(componentMap) {
    this.componentMap = componentMap;
    this.keyMap = this.getGame().keyMap;
    this.bindKeyMap();
    this.bindMouseFunc();
};

InputManager.prototype.tick = function(componentMap) {
    this.componentMap = componentMap;
};

InputManager.prototype.bindKeyMap = function() {
    MouseTrap.reset();
    var self = this;

    for (var event in this.keyMap) {
        var keys = this.keyMap[event];
        if (!_.isArray(keys)) {
            keys = [keys];
        }

        keys.forEach(function(key) {
            MouseTrap.bind(key, function() {
                var eventCopy = event.slice(0);
                return function() {
                    for (var id in self.componentMap) {
                        self.componentMap[id].bindings.forEach(function(binding) {
                            if (binding.type == 'keydown' && binding.event == eventCopy) {
                                binding.func(eventCopy);
                            }
                        });
                    }

                    return false;
                }
            }());

            MouseTrap.bind(key, function() {
                var eventCopy = event.slice(0);
                return function() {
                    for (var id in self.componentMap) {
                        self.componentMap[id].bindings.forEach(function(binding) {
                            if (binding.type == 'keyup' && binding.event == eventCopy) {
                                binding.func(eventCopy);
                            }
                        });
                    }

                    return false;
                }
            }(), 'keyup');
        });
    }
};

InputManager.prototype.handleMousedown = function(e) {
    this.inputState.mousehold = true;

    for (var id in this.componentMap) {
        var component = this.componentMap[id];
        component.mousedownFunc.forEach(function(func) {
            func();
        });
    }
};

InputManager.prototype.handleMouseup = function() {
    this.inputState.mousehold = false;

    for (var id in this.componentMap) {
        var component = this.componentMap[id];
        component.mouseupFunc.forEach(function(func) {
            func();
        });
    }
};

InputManager.prototype.handleMousemove = function(e) {
    this.inputState.mouseX = e.clientX;
    this.inputState.mouseY = e.clientY;

    for (var id in this.componentMap) {
        var component = this.componentMap[id];
        component.mousemoveFunc.forEach(function(func) {
            func({
                x: e.clientX,
                y: e.clientY
            });
        });
    }
};

InputManager.prototype.handleMouseleave = function() {
    this.inputState.mousehold = false;
};

InputManager.prototype.afterTick = function() {
    //clear temporary control states
    this.inputState.clearTemporaryStates();
};

module.exports = InputManager;
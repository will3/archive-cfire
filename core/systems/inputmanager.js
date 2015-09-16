var $ = require('jquery');
var _ = require('lodash');
try {
    var MouseTrap = require('mousetrap');
} catch (err) {
    console.log('failed to load MouseTrap');
}

var InputComponent = require('../components/inputcomponent');
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

    var self = this;

    var bindMouseFunc = params.bindMouseFunc || function() {
        $(window).mousemove(self.handleMousemove.bind(self));
        $(window).mousedown(self.handleMousedown.bind(self));
        $(window).mouseup(self.handleMouseup.bind(self));
        $(window).mouseleave(self.handleMouseleave.bind(self));
    };

    bindMouseFunc();

    this.componentPredicate = function(component) {
        return component instanceof InputComponent;
    }

    this.keyMap = null;
};

InputManager.prototype = Object.create(System.prototype);
InputManager.prototype.constructor = InputManager;

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
                }
            }(), 'keyup');
        });
    }
};

InputManager.prototype.handleMousedown = function(e) {
    for (var id in this.componentMap) {
        var component = this.componentMap[id];
        component.mousedownFunc.forEach(function(func) {
            func();
        });
    }
};

InputManager.prototype.handleMouseup = function() {
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

InputManager.prototype.start = function() {
    this.keyMap = this.getGame().keyMap;
    this.bindKeyMap();
};

InputManager.prototype.afterTick = function() {
    //clear temporary control states
    this.inputState.clearTemporaryStates();
};

module.exports = InputManager;
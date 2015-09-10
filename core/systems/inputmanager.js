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
//keyMap        key map to load, defaults to {}
//inputState    inputState to manage, this instance is assigned to this.inputState, by default create default instance
var InputManager = function(params) {
    System.call(this);

    this.mouseLastX = null;
    this.mouseLastY = null;
    this.mouseLastDragX = null;
    this.mouseLastDragY = null;

    params = params || {};

    this.keyMap = params.keyMap || {};
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

    this.bindKeyMap();
};

InputManager.prototype = Object.create(System.prototype);
InputManager.prototype.constructor = InputManager;

InputManager.prototype.bindKeyMap = function() {
    MouseTrap.reset();
    var self = this;

    for (var event in this.keyMap) {
        var keys = this.keyMap[event];
        keys.forEach(function(key) {
            MouseTrap.bind(key, function() {
                if (!self.inputState.keyhold(key)) {
                    self.inputState.keydowns.push(key);
                    self.inputState.keyholds.push(key);
                }
            });

            MouseTrap.bind(key, function() {
                if (!self.inputState.keyup(key)) {
                    self.inputState.keyups.push(key);
                }

                _.pull(self.inputState.keyholds, key);
            }, 'keyup');
        });
    }
};

InputManager.prototype.handleMousedown = function() {
    this.inputState.mousedown = true;
    this.inputState.mousehold = true;
};

InputManager.prototype.handleMouseup = function() {
    this.inputState.mouseup = true;
    this.inputState.mousehold = false;
};

InputManager.prototype.handleMousemove = function(e) {
    this.inputState.mouseX = e.clientX;
    this.inputState.mouseY = e.clientY;

    if (this.mouseLastX == null || this.mouseLastY == null) {
        this.mouseLastX = e.clientX;
        this.mouseLastY = e.clientY;
    }

    this.inputState.mouseMoveX += (e.clientX - this.mouseLastX);
    this.inputState.mouseMoveY += (e.clientY - this.mouseLastY);

    if (this.inputState.mousehold) {
        this.inputState.mouseDragX += (e.clientX - this.mouseLastX);
        this.inputState.mouseDragY += (e.clientY - this.mouseLastY);
    }

    this.mouseLastX = e.clientX;
    this.mouseLastY = e.clientY;
};

InputManager.prototype.handleMouseleave = function() {
    this.inputState.mousehold = false;
};

InputManager.prototype.tick = function() {
    var self = this;

    for (var id in this.componentMap) {
        var inputComponent = this.componentMap[id];

        inputComponent.bindings.forEach(function(binding) {
            self.processBinding(binding);
        });
    };
};

InputManager.prototype.afterTick = function() {
    //clear temporary control states
    this.inputState.clearTemporaryStates();
};

InputManager.prototype.processBinding = function(binding) {
    var keys = this.keyMap[binding.event];
    var target = binding.target;
    var func = binding.func;
    var inputState = this.inputState;
    //no key map exists
    if (keys == null) {
        return;
    }

    switch (binding.type) {
        case 'keyup':
            {
                if (_.some(keys, function(key) {
                        return inputState.keyup(key);
                    })) {
                    target[func]();
                }
            }
            break;

        case 'keydown':
            {
                if (_.some(keys, function(key) {
                        return inputState.keydown(key);
                    })) {
                    target[func]();
                }
            }
            break;

        case 'keyhold':
            {
                if (_.some(keys, function(key) {
                        return inputState.keyhold(key);
                    })) {
                    target[func](1.0);
                }
            }
            break;

        default:

    }
};

module.exports = InputManager;
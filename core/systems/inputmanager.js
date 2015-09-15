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
        keys.forEach(function(key) {
            MouseTrap.bind(key, function() {
                if (!self.inputState.keydown(key)) {
                    self.inputState.keydowns.push(key);
                }

                if (!self.inputState.keyhold(key)) {
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

InputManager.prototype.handleMousedown = function(e) {
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

InputManager.prototype.start = function() {
    this.keyMap = this.getGame().keyMap;
    this.bindKeyMap();
};

InputManager.prototype.tick = function() {
    var self = this;

    for (var id in this.componentMap) {
        var inputComponent = this.componentMap[id];

        inputComponent.bindings.forEach(function(binding) {
            self.processBinding(binding);
        });

        inputComponent.mousedownFunc.forEach(function(func) {
            if (self.inputState.mousedown) {
                func();
            }
        });

        inputComponent.mouseupFunc.forEach(function(func) {
            if (self.inputState.mouseup) {
                func();
            }
        });

        inputComponent.mousemoveFunc.forEach(function(func) {
            if (self.inputState.mouseMoveX != 0 || self.inputState.mouseMoveY != 0) {
                func({
                    x: self.inputState.mouseMoveX,
                    y: self.inputState.mouseMoveY,
                    dragX: self.inputState.mouseDragX,
                    dragY: self.inputState.mouseDragY
                });
            }
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
                    func();
                }
            }
            break;

        case 'keydown':
            {
                if (_.some(keys, function(key) {
                        return inputState.keydown(key);
                    })) {
                    func();
                }
            }
            break;

        case 'keyhold':
            {
                if (_.some(keys, function(key) {
                        return inputState.keyhold(key);
                    })) {
                    func();
                }
            }
            break;

        default:

    }
};

module.exports = InputManager;
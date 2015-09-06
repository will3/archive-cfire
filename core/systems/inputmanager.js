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
    var bindKeyboardFunc = params.bindKeyboardFunc || function() {
        $(window).keydown(self.handleKeydown.bind(self));
        $(window).keyup(self.handleKeyup.bind(self));
    };

    bindKeyboardFunc();

    var bindMouseFunc = params.bindMouseFunc || function() {
        $(window).mousemove(self.handleMousemove.bind(self));
        $(window).mousedown(self.handleMousedown.bind(self));
        $(window).mouseup(self.handleMouseup.bind(self));
        $(window).mouseleave(self.handleMouseleave.bind(self));
    };

    bindMouseFunc();
};

InputManager.prototype = Object.create(System.prototype);
InputManager.prototype.constructor = InputManager;

InputManager.prototype.handleKeydown = function(e) {
    var key = String.fromCharCode(e.keyCode).toLowerCase();

    if (!this.inputState.keyhold(key)) {
        this.inputState.keydowns.push(key);
        this.inputState.keyholds.push(key);
    }
};

InputManager.prototype.handleKeyup = function(e) {
    var key = String.fromCharCode(e.keyCode).toLowerCase();

    if (!this.inputState.keyup(key)) {
        this.inputState.keyups.push(key);
    }

    _.pull(this.inputState.keyholds, key);
};

InputManager.prototype.handleMousedown = function() {
    this.inputState.mousedown = true;
};

InputManager.prototype.handleMouseup = function() {
    this.inputState.mousedown = false;
};

InputManager.prototype.handleMousemove = function(e) {
    if (this.mouseLastX == null || this.mouseLastY == null) {
        this.mouseLastX = e.clientX;
        this.mouseLastY = e.clientY;
    }

    this.inputState.mouseMoveX += (e.clientX - this.mouseLastX);
    this.inputState.mouseMoveY += (e.clientY - this.mouseLastY);

    if (this.inputState.mousedown) {
        this.inputState.mouseDragX += (e.clientX - this.mouseLastX);
        this.inputState.mouseDragY += (e.clientY - this.mouseLastY);
    }

    this.mouseLastX = e.clientX;
    this.mouseLastY = e.clientY;
};

InputManager.prototype.handleMouseleave = function() {
    this.inputState.mousedown = false;
};

InputManager.prototype.tick = function(entitySystem) {
    var self = this;

    entitySystem.getEntities().forEach(function(entity) {
        var inputComponent = entity.getComponent(InputComponent);

        //skip entities without input components
        if (inputComponent == null) {
            return;
        }

        inputComponent.bindings.forEach(function(binding) {
            self.processBinding(binding);
        });
    });
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
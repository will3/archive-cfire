var $ = require('jquery');
var _ = require('lodash');
try {
    var MouseTrap = require('mousetrap');
} catch (err) {
    console.log('failed to load MouseTrap');
}

var InputComponent = require('../components/inputcomponent');
var System = require('../system');

//params
//keyMap    key map to load, defaults to {}
var InputManager = function(params) {
    System.call(this);

    params = params || {};

    this.keyMap = params.keyMap || {};

    this.keydowns = [];
    this.keyups = [];
    this.keyholds = [];

    this.mousedown = false;

    this.mouseMoveX = 0;
    this.mouseMoveY = 0;
    this.mouseDragX = 0;
    this.mouseDragY = 0;

    this.mouseLastX = null;
    this.mouseLastY = null;

    var bindKeyboardFunc = params.bindKeyboardFunc || function() {
        $(window).keydown(this.handleKeydown.bind(this));
        $(window).keyup(this.handleKeyup.bind(this));
    }.bind(this);
    bindKeyboardFunc();

    var bindMouseFunc = params.bindMouseFunc || function() {
        $(window).mousemove(this.handleMousemove.bind(this));
        $(window).mousedown(this.handleMousedown.bind(this));
        $(window).mouseup(this.handleMouseup.bind(this));
        $(window).mouseleave(this.handleMouseleave.bind(this));
    };

};

InputManager.prototype = Object.create(System.prototype);
InputManager.prototype.constructor = InputManager;

InputManager.prototype.handleKeydown = function(e) {
    var key = String.fromCharCode(e.keyCode).toLowerCase();

    if (!_.includes(this.keyholds, key)) {
        this.keydowns.push(key);
        this.keyholds.push(key);
    }
};

InputManager.prototype.handleKeyup = function(e) {
    var key = String.fromCharCode(e.keyCode).toLowerCase();

    if (!_.includes(this.keyups, key)) {
        this.keyups.push(key);
    }

    _.pull(this.keyholds, key);
};

InputManager.prototype.handleMousedown = function() {
    this.mousedown = true;
};

InputManager.prototype.handleMouseup = function() {
    this.mousedown = false;
};

InputManager.prototype.handleMousemove = function(e) {
    if (this.mouseLastX == null || this.mouseLastY == null) {
        this.mouseLastX = e.clientX;
        this.mouseLastY = e.clientY;
        return;
    }

    this.mouseMoveX = e.clientX - this.mouseLastX;
    this.mouseMoveY = e.clientY - this.mouseLastY;

    if (this.mousedown) {
        this.mouseDragX = this.mouseMoveX;
        this.mouseDragY = this.mouseMoveY;
    }
};

InputManager.prototype.handleMouseleave = function() {
    this.mousedown = false;
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
    this.keydowns = [];
    this.keyups = [];
    this.mouseMoveX = 0;
    this.mouseMoveY = 0;
    this.mouseDragX = 0;
    this.mouseDragY = 0;
};

InputManager.prototype.processBinding = function(binding) {
    var keys = this.keyMap[binding.event];
    var target = binding.target;
    var func = binding.func;
    var self = this;

    //no key map exists
    if (keys == null) {
        return;
    }

    switch (binding.type) {
        case 'keyup':
            {
                if (_.some(keys, function(key) {
                        return _.includes(self.keyups, key);
                    })) {
                    target[func]();
                }
            }
            break;

        case 'keydown':
            {
                if (_.some(keys, function(key) {
                        return _.includes(self.keydowns, key);
                    })) {
                    target[func]();
                }
            }
            break;

        case 'keyhold':
            {
                if (_.some(keys, function(key) {
                        return _.includes(self.keyholds, key);
                    })) {
                    target[func](1.0);
                }
            }
            break;

        default:

    }
};

module.exports = InputManager;
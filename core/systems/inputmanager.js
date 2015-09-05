var $ = require('jquery');
var _ = require('lodash');
try {
    var MouseTrap = require('mousetrap');
} catch (err) {
    console.log('failed to load MouseTrap');
}

var InputComponent = require('../components/inputcomponent');

//params
//keyMap	key map to load, defaults to {}
var InputManager = function(params) {
    params = params || {};

    this.keyMap = params.keyMap || {};

    this.keydowns = [];
    this.keyups = [];
    this.keyholds = [];

    var bindKeyboardFunc = params.bindKeyboardFunc || function() {
        $(window).keydown(this.handleKeydown.bind(this));
        $(window).keyup(this.handleKeyup.bind(this));
    }.bind(this);

    bindKeyboardFunc();
};

InputManager.prototype = {
    constructor: InputManager,

    handleKeydown: function(e) {
        var key = String.fromCharCode(e.keyCode).toLowerCase();

        if (!_.includes(this.keyholds, key)) {
            this.keydowns.push(key);
            this.keyholds.push(key);
        }
    },

    handleKeyup: function(e) {
        var key = String.fromCharCode(e.keyCode).toLowerCase();

        if (!_.includes(this.keyups, key)) {
            this.keyups.push(key);
        }

        _.pull(this.keyholds, key);
    },

    tick: function(world) {
        var self = this;

        world.entities.forEach(function(entity) {
            var inputComponent = entity.get(InputComponent);

            //skip entities without input components
            if (inputComponent == null) {
                return;
            }

            inputComponent.bindings.forEach(function(binding) {
                self.processBinding(binding);
            });
        });

        this.reset();
    },

    processBinding: function(binding) {
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
    },

    //clear temporary control states
    reset: function() {
        this.keydowns = [];
        this.keyups = [];
    }
};

module.exports = InputManager;
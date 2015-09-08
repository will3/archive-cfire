var _ = require('lodash');

var InputState = function() {
    this.keydowns = [];
    this.keyups = [];
    this.keyholds = [];
    this.keyEvents = [];

    this.mousedown = false;

    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseMoveX = 0;
    this.mouseMoveY = 0;
    this.mouseDragX = 0;
    this.mouseDragY = 0;
};

InputState.prototype = {
    constructor: InputState,

    //return if the char key is being holding down
    keyhold: function(key) {
        return _.includes(this.keyholds, key);
    },


    //return if the char key is just released
    //this value will be cleared after each tick
    keyup: function(key) {
        return _.includes(this.keyups, key);
    },

    //return if the char key is just pressed down
    //this value will be cleared after each tick
    keydown: function(key) {
        return _.includes(this.keydowns, key);
    },

    //clear all temporary states, typically called after tick
    clearTemporaryStates: function() {
        this.keydowns = [];
        this.keyups = [];
        this.keyEvents = [];
        this.mouseMoveX = 0;
        this.mouseMoveY = 0;
        this.mouseDragX = 0;
        this.mouseDragY = 0;
    }
}

module.exports = InputState;
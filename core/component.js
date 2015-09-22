var _ = require('lodash');
var uuid = require('uuid-v4');
var getGame = require('../core/macros/getgame');

var Component = function() {
    this.id = uuid();
    this.started = false;
    this.name = null;

    //event bindings
    this.bindings = [];
    this.mousemoveFunc = [];
    this.mousedownFunc = [];
    this.mouseupFunc = [];

    this._transform = null;
};

var defaultFunc = function() {};

Component.prototype = {
    constructor: Component,

    defaultFunc: defaultFunc,

    start: defaultFunc,

    tick: defaultFunc,

    afterTick: defaultFunc,

    getComponent: function(type) {
        return getGame().entityManager.getOwningEntity(this.id).getComponent(type);
    },

    getComponents: function() {
        return getGame().entityManager.getOwningEntity(this.id).getComponents();
    },

    getOwningEntity: function() {
        return getGame().entityManager.getOwningEntity(this.id);
    },

    get transform() {
        if(this._transform == null){
            this._transform = getGame().entityManager.getOwningEntity(this.id).transform;
        }
        
        return this._transform;
    },

    get root() {
        return this.getGame();
    },

    getGame: function() {
        return getGame();
    },

    getEntityByName: function(name) {
        return getGame().entityManager.getEntityByName(name);
    },

    getComponentByName: function(name) {
        return _.find(getGame().entityManager.getOwningEntity(this.id).getComponents(), function(component) {
            return component.name === name;
        });
    },

    notify: function(func, param) {
        var self = this;
        this.getOwningEntity().getComponents().forEach(function(component) {
            if (component == self) {
                return;
            }

            if (component[func] == null) {
                return;
            }

            component[func](param);
        });
    },

    _bind: function(event, type, func) {
        this.bindings.push({
            type: type,
            event: event,
            func: func
        });

        this.root.evaluateComponent(this);
    },

    bindKeyDown: function(event, func) {
        if (_.isArray(event)) {
            event.forEach(function(v) {
                this.keydown(v, func);
            }.bind(this));
            return;
        }

        this._bind(event, 'keydown', func);
        this.root.evaluateComponent(this);
    },

    bindKeyUp: function(event, func) {
        if (_.isArray(event)) {
            event.forEach(function(v) {
                this.keyup(v, func);
            }.bind(this));
            return;
        }

        this._bind(event, 'keyup', func);
        this.root.evaluateComponent(this);
    },

    bindMouseMove: function(func) {
        this.mousemoveFunc.push(func);
        this.root.evaluateComponent(this);
    },

    bindMouseDown: function(func) {
        this.mousedownFunc.push(func);
        this.root.evaluateComponent(this);
    },

    bindMouseUp: function(func) {
        this.mouseupFunc.push(func);
        this.root.evaluateComponent(this);
    }
};

module.exports = Component;
var $ = require('jquery');
var Renderer = require('./systems/renderer');
var InputManager = require('./systems/inputmanager');
var register = require('./macros/getgame').register;
var EntityManager = require('./entitymanager');

//params
//container: jquery container for game window, defaults to $('#container')
//window: window object, used for resize events, defaults to window
//renderer: provide a renderer, Game will create one by default
//inputManager: provide a input manager, Game will create one by default
//skipRegister: skip registering for game singleton, setting this true will stop macros will funcitoning, defaults to false
var Game = function(params) {
    params = params || {};

    this.entityManager = new EntityManager();

    this.systems = [];

    var container = params.container || $('#container');

    this.renderer = params.renderer || new Renderer(container, params.window || window);
    this.systems.push(this.renderer);

    this.inputManager = params.inputManager || new InputManager({
        keyMap: params.keyMap || {}
    });
    this.systems.push(this.inputManager);

    var skipRegister = params.skipRegister || false;
    if (!skipRegister) {
        register(this);
    }

    //focus container by default
    container.focus();
};

Game.prototype = {
    constructor: Game,

    tick: function(elapsedTime) {
        var self = this;
        this.systems.forEach(function(system) {
            system.tick(self.entityManager, elapsedTime);
        });
    },

    afterTick: function() {
        var self = this;
        this.systems.forEach(function(system) {
            system.afterTick();
        });
    }
};

module.exports = Game;
var $ = require('jquery');
var Renderer = require('./systems/renderer');
var InputManager = require('./systems/inputmanager');
var InputState = require('./inputstate');
var EntityManager = require('./entitymanager');
var registerGame = require('./macros/getgame').register;
var registerInput = require('./macros/getinput').register;

//params
//container: jquery container for game window, defaults to $('#container')
//window: window object, used for resize events, defaults to window
//renderer: provide a renderer, Game will create one by default
//inputManager: provide a input manager, Game will create one by default
//skipRegisterGame: skip registering for game singleton, setting this true will stop macros will funcitoning, defaults to false
var Game = function(params) {
    params = params || {};

    this.entityManager = new EntityManager();

    this.systems = [];

    var container = params.container || $('#container');

    this.renderer = params.renderer || new Renderer(container, params.window || window);
    this.systems.push(this.renderer);

    this.inputState = new InputState();
    registerInput(this.inputState);

    this.inputManager = params.inputManager || new InputManager({
        keyMap: params.keyMap || {},
        inputState: this.inputState
    });
    this.systems.push(this.inputManager);

    var skipRegisterGame = params.skipRegisterGame || false;
    if (!skipRegisterGame) {
        registerGame(this);
    }

    //focus container by default
    container.focus();
};

Game.prototype = {
    constructor: Game,

    tick: function(elapsedTime) {
        var self = this;
        //tick each system
        this.systems.forEach(function(system) {
            system.tick(self.entityManager, elapsedTime);
        });

        //tick entities and components
        //this is so that components and entities gets ticked if implemented
        this.entityManager.tick();
    },

    afterTick: function() {
        var self = this;
        this.systems.forEach(function(system) {
            system.afterTick();
        });

        this.entityManager.afterTick();
    }
};

module.exports = Game;
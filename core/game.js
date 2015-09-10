var $ = require('jquery');
var _ = require('lodash');

var Renderer = require('./systems/renderer');
var InputManager = require('./systems/inputmanager');
var ScriptManager = require('./systems/scriptmanager');
var Collision = require('./systems/collision');
var Lighting = require('./systems/lighting');

var InputState = require('./inputstate');
var EntityManager = require('./entitymanager');
var registerGame = require('./macros/getgame').register;

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

    this.container = params.container || $('#container');
    //focus container by default
    this.container.focus();

    this.renderer = params.renderer || new Renderer(this.container, params.window || window);
    this.systems.push(this.renderer);

    this.inputState = new InputState();

    this.inputManager = params.inputManager || new InputManager({
        keyMap: params.keyMap || {},
        inputState: this.inputState
    });
    this.systems.push(this.inputManager);

    this.scriptManager = new ScriptManager();
    this.systems.push(this.scriptManager);

    this.collision = new Collision();
    this.systems.push(this.collision);

    this.lighting = new Lighting(this.renderer);
    this.systems.push(this.lighting);

    var skipRegisterGame = params.skipRegisterGame || false;
    if (!skipRegisterGame) {
        registerGame(this);
    }

    var self = this;
    this.systems.forEach(function(system) {
        system.setEntityManager(self.entityManager);
    });
};

Game.prototype = {
    constructor: Game,

    get input() {
        return this.inputState;
    },

    get camera() {
        return this.renderer.camera;
    },

    tick: function(elapsedTime) {
        var self = this;
        //tick each system
        this.systems.forEach(function(system) {
            system.tick(elapsedTime);
        });
    },

    afterTick: function() {
        var self = this;
        this.systems.forEach(function(system) {
            system.afterTick();
        });
    },

    addEntity: function(entity) {
        this.entityManager.addEntity(entity);
    },

    getMouseCollision: function() {
        return this.collision.mouseCollision;
    },

    addObject3d: function(object) {
        this.renderer.scene.add(object);
    },

    removeObject3d: function(object) {
        this.renderer.scene.remove(object);
    }
};

module.exports = Game;
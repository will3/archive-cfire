var _ = require('lodash');
var $ = require('jquery');

var InputState = require('./inputstate');
var EntityManager = require('./entitymanager');
var registerGame = require('./macros/getgame').register;

var Renderer = require('./systems/renderer');
var InputManager = require('./systems/inputmanager');
var Collision = require('./systems/collision');
var Console = require('./systems/console');

//params
//skipRegisterGame: skip registering for game singleton, setting this true will stop macros will funcitoning, defaults to false
//systems: systems this game should run, creates default set if left empty
//keyMap: key map
//types: type bindings
var Game = function(params) {
    params = params || {};

    this.keyMap = params.keyMap;

    this.entityManager = new EntityManager();

    this.systems = [];

    this.container = params.container || $('#container');

    var skipRegisterGame = params.skipRegisterGame || false;
    if (!skipRegisterGame) {
        registerGame(this);
    }

    this.systems = params.systems || require('./systems');

    this.renderer = this.getSystem(Renderer);
    this.inputManager = this.getSystem(InputManager);
    this.collision = this.getSystem(Collision);
    this.console = this.getSystem(Console);
};

Game.prototype = {
    constructor: Game,

    get input() {
        return this.inputManager.inputState;
    },

    get camera() {
        return this.renderer.camera;
    },

    getMouseCollisions: function() {
        return this.collision.mouseCollisions;
    },

    getSystem: function(type) {
        return _.find(this.systems, function(system) {
            return system instanceof type;
        });
    },

    start: function() {
        var self = this;
        this.systems.forEach(function(system) {
            system.setEntityManager(self.entityManager);
        });

        //disable right click
        document.oncontextmenu = document.body.oncontextmenu = function() {
            return false;
        }
    },

    tick: function(elapsedTime) {
        var self = this;
        //tick each system
        this.systems.forEach(function(system) {
            if (!system.started) {
                system.start();
                system.started = true;
            }
            system.tick(elapsedTime);
        });
    },

    afterTick: function() {
        var self = this;
        this.systems.forEach(function(system) {
            system.afterTick();
        });
    },

    getEntityByName: function(name) {
        return this.entityManager.getEntityByName(name);
    },

    addEntity: function(entity) {
        this.entityManager.addEntity(entity);
    },

    addObject3d: function(object) {
        this.renderer.scene.add(object);
    },

    removeObject3d: function(object) {
        this.renderer.scene.remove(object);
    },

    load: function(data) {
        var loader = require('./loader')(this);
        loader.load(data);
    }
};

module.exports = Game;
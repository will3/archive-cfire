var _ = require('lodash');
var $ = require('jquery');
var extend = require('extend');

var InputState = require('./inputstate');
var EntityManager = require('./entitymanager');
var registerGame = require('./macros/getgame').register;

var Renderer = require('./systems/renderer');
var InputManager = require('./systems/inputmanager');
var Collision = require('./systems/collision');
var Console = require('./systems/console');

//params
//systems: systems this game should run, creates default set if left empty
//keyMap: key map
//types: type bindings,
//autoStart: automatically calls start when game is created, defaults to true
var Game = function(params) {
    params = params || {};

    //key map
    this.keyMap = params.keyMap;

    //tick rate
    this.tickRate = params.tickRate || 48.0;

    //scenario
    this.scenario = params.scenario;

    //entity manager
    this.entityManager = new EntityManager();

    //main container
    this.container = params.container || $('#container');

    //register singleton
    registerGame(this);

    //systems
    this.systems = params.systems || require('./systems');

    this.renderer = this.systems.renderer;
    this.inputManager = this.systems.inputManager;
    this.collision = this.systems.collision;

    //register types
    extend(require('./macros/types'), params.types || {});

    //map of component(s) relevant for systems
    this.componentMap = {};

    var autoStart = params.autoStart || true;

    if (params.autoStart !== false) {
        this.start();
    }
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

    start: function() {

        this.entityManager.onAddComponent(function(component) {
            this.evaluateComponent(component);
        }.bind(this));

        this.entityManager.onRemoveComponent(function() {
            for (var key in this.systems) {
                var system = this.systems[key];
                var map = this.systems[key];
                if (map == null) {
                    map = this.componentMap[key] = {};
                }

                if (map[component.id] != null) {
                    system.destroyComponent(component);
                    delete map[component.id];
                }
            }
        }.bind(this));

        //load scenario
        if (this.scenario != null) {
            var loader = require('./loader')(this);
            loader.load(this.scenario);
        }

        //disable right click
        document.oncontextmenu = document.body.oncontextmenu = function() {
            return false;
        }

        //start update loop
        var interval = function() {
            this.tick(1000.0 / this.tickRate);
            this.afterTick();
            setTimeout(interval, 1000.0 / this.tickRate);
        }.bind(this);

        interval();
    },

    tick: function(elapsedTime) {
        var self = this;
        //tick each system

        for (var key in this.systems) {
            var system = this.systems[key];
            if (!system.started) {
                system.start();
                system.started = true;
            }
            var componentMap = this.componentMap[key];
            system.tick(componentMap, elapsedTime);
        }
    },

    afterTick: function() {
        for (var key in this.systems) {
            var system = this.systems[key];
            system.afterTick();
        }
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

    evaluateComponent: function(component) {
        for (var key in this.systems) {
            var system = this.systems[key];
            var map = this.componentMap[key];
            if (map == null) {
                map = this.componentMap[key] = {};
            }

            if (system.componentPredicate(component)) {
                map[component.id] = component;
            }
        }
    },

    addEntityFromPrefab: function(key) {
        var prefab = this.scenario.prefabs[key];
        if (prefab == null) {
            throw "can't load prefab";
        }

        var loader = require('./loader')(this);
        return loader.addEntity(this, prefab);
    }
};

module.exports = Game;
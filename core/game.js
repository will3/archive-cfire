var $ = require('jquery');
var World = require('./world');
var Renderer = require('./systems/renderer');
var InputManager = require('./systems/inputmanager');

//params
//container: jquery container for game window, defaults to $('#container')
//window: window object, used for resize events, defaults to window
//renderer: provide a renderer, Game will create one by default
//inputManager: provide a input manager, Game will create one by default

var Game = function(params) {
    params = params || {};

    this.world = new World();

    this.systems = [];

    var container = params.container || $('#container');

    this.renderer = params.renderer || new Renderer(container, params.window || window);
    this.systems.push(this.renderer);

    this.inputManager = params.inputManager || new InputManager({
        keyMap: params.keyMap || {}
    });
    this.systems.push(this.inputManager);

    //focus container by default
    container.focus();
};

Game.prototype = {
    constructor: Game,

    tick: function(elapsedTime) {
        var self = this;
        this.systems.forEach(function(system) {
            system.tick(self.world, elapsedTime);
        });
    },

    addEntity: function(entity) {
        this.world.addEntity(entity);
    }
};

module.exports = Game;
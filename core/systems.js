var $ = require('jquery');

var Renderer = require('./systems/renderer');
var InputManager = require('./systems/inputmanager');
var ScriptManager = require('./systems/scriptmanager');
var Collision = require('./systems/collision');
var Lighting = require('./systems/lighting');
var Console = require('./systems/console');
var Physics = require('./systems/physics');

var container = $('#container');

var renderer = new Renderer(container, window);

var inputManager = new InputManager();

var scriptManager = new ScriptManager();

var collision = new Collision();

var lighting = new Lighting(renderer);

var console = new Console();

var physics = new Physics();

module.exports = {
    renderer: renderer,
    inputManager: inputManager,
    scriptManager: scriptManager,
    collision: collision,
    lighting: lighting,
    console: console,
    physics: physics
};
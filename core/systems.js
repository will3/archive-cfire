var $ = require('jquery');

var Renderer = require('./systems/renderer');
var InputManager = require('./systems/inputmanager');
var ScriptManager = require('./systems/scriptmanager');
var Collision = require('./systems/collision');
var Lighting = require('./systems/lighting');
var Console = require('./systems/console');

var renderer = new Renderer($('#container'), window);

var inputManager = new InputManager();

var scriptManager = new ScriptManager();

var collision = new Collision();

var lighting = new Lighting(renderer);

var console = new Console();

module.exports = [renderer, inputManager, scriptManager, collision, lighting, console];
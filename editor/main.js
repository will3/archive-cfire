var THREE = require('three');

var runGame = require('../core/rungame');
var Entity = require('../core/entity');

var RenderComponent = require('../core/components/rendercomponent');
var CollisionBody = require('../core/components/collisionbody');
var LightComponent = require('../core/components/lightcomponent');
var InputComponent = require('../core/components/inputcomponent');

var GridController = require('./components/gridcontroller');
var CameraController = require('./components/cameracontroller');
var InputController = require('./components/inputcontroller');
var ChunkController = require('./components/chunkcontroller');
var PointerController = require('./components/pointercontroller');
var FormController = require('./components/formcontroller');

window.onload = function() {
    var Game = require('../core/game');

    var game = new Game({
        keyMap: require('./keymap'),
        types: {
            'GridController': require('./components/gridcontroller'),
            'CameraController': require('./components/cameracontroller'),
            'InputController': require('./components/inputcontroller'),
            'ChunkController': require('./components/chunkcontroller'),
            'PointerController': require('./components/pointercontroller'),
            'FormController': require('./components/formcontroller')
        },
        scenario: require('./scenario')
    });

    runGame(game);
};
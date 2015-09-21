var Engine = require('../core/engine');
var Game = Engine.Game;

window.onload = function() {
    var game = new Game({
        scenario: require('./scenario'),
        types: {
            'GridController': require('./components/gridcontroller'),
            'InputController': require('./components/inputcontroller'),
            'ChunkController': require('./components/chunkcontroller'),
            'PointerController': require('./components/pointercontroller'),
            'FormController': require('./components/formcontroller')
        },
        keyMap: require('./keymap')
    });
};
var runGame = require('../core/rungame');

window.onload = function() {
    runGame({
        scenario: require('./scenario'),
        types: {
            'GridController': require('./components/gridcontroller'),
            'CameraController': require('./components/cameracontroller'),
            'InputController': require('./components/inputcontroller'),
            'ChunkController': require('./components/chunkcontroller'),
            'PointerController': require('./components/pointercontroller'),
            'FormController': require('./components/formcontroller')
        },
        keyMap: require('./keymap')
    });
};
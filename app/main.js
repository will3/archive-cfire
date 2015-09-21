var Engine = require('../core/engine');
var Game = Engine.Game;

window.onload = function() {
    var game = new Game({
        scenario: require('./scenario.json'),
        types: {
            'BlockModel': require('./components/blockmodel'),
            'InputController': require('./components/inputcontroller'),
            'ShipController': require('./components/shipcontroller')
        }
    });
}
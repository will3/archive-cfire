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

    for (var i = 0; i < 500; i++) {
        var frigate = game.addEntityFromPrefab('frigate');
        frigate.transform.position.x = Math.random() * 1000 - 500;
        frigate.transform.position.y = Math.random() * 1000 - 500;
        frigate.transform.position.z = Math.random() * 1000 - 500;
    }

}
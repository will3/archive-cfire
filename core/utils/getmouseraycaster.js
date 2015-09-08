var THREE = require('three');
var getGame = require('../macros/getgame');

module.exports = function() {
    var rayCaster = new THREE.RayCaster();

    var input = getGame().input;
    var container = getGame().container;
    var camera = getGame().camera;

    var mouse = new THREE.Vector2();
    mouse.x = (input.mouseX / container.width()) * 2 - 1;
    mouse.y = -(input.mouseY / container.height()) * 2 + 1;

    rayCaster.setFromCamera(mouse, camera);
}
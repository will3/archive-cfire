var THREE = require('three');
var getGame = require('../macros/getgame');

module.exports = function() {
    var raycaster = new THREE.Raycaster();

    var input = getGame().input;
    var container = getGame().container;
    var camera = getGame().camera;

    var mouse = new THREE.Vector2();
    mouse.x = (input.mouseX / container.width()) * 2 - 1;
    mouse.y = -(input.mouseY / container.height()) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    return raycaster;
}
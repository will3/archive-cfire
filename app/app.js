var $ = require('jquery');
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
require('spectrum-colorpicker')($);

var defaultColor = 'rgb(0, 188, 212)';
window.onload = function() {
    var colorPickerDiv = $("<div id='color-picker-container'>");
    colorPickerDiv.css('position', 'absolute');
    colorPickerDiv.css('left', 20 + 'px');
    colorPickerDiv.css('top', 20 + 'px');

    var colorPicker = $("<input type='text' id='color-picker'/>");
    colorPickerDiv.append(colorPicker);
    $('#container').append(colorPickerDiv);

    colorPicker.spectrum({
        color: defaultColor,
        showPalette: true,
        showSelectionPalette: true,
        palette: [],
        localStorageKey: "spectrum.homepage",
        palette: [
            [
                'rgb(183, 28, 28)',
                'rgb(233, 30, 99)',
                'rgb(156, 39, 176)',
                'rgb(103, 58, 183)',
                'rgb(63, 81, 181)',
                'rgb(33, 150, 243)',
                'rgb(0, 188, 212)',
                'rgb(76, 175, 80)',
                'rgb(255, 235, 59)',
                'rgb(255, 152, 0)',
                'rgb(189, 189, 189)',
                'rgb(96, 125, 139)'
            ],
        ],
        change: function(color) {
            inputController.color = new THREE.Color(color.toRgbString()).getHex()
        }
    });

    var Game = require('../core/game');

    var game = new Game({
        keyMap: require('./keymap')
    });

    addGrid(game);
    addChunk(game);
    addInput(game);
    addLights(game);

    var inputController = game.getEntityByName('input').getComponent(InputController);


    runGame(game);
};

var addGrid = function(game) {
    var entity = new Entity();
    entity.name = 'grid';

    game.addEntity(entity);

    entity.addComponent(RenderComponent);
    entity.addComponent(GridController);
    entity.addComponent(CollisionBody);
};

var addChunk = function(game) {
    var entity = new Entity();
    entity.name = 'chunk';

    game.addEntity(entity);

    entity.addComponent(ChunkController);
    entity.addComponent(RenderComponent);
    entity.addComponent(CollisionBody);
};

var addInput = function(game) {
    var entity = new Entity();
    entity.name = 'input';

    game.addEntity(entity);

    entity.addComponent(CameraController);
    var inputController = entity.addComponent(InputController);
    inputController.color = new THREE.Color(defaultColor).getHex();
    entity.addComponent(InputComponent);
};

var addLights = function(game) {
    var entity = new Entity();
    entity.name = 'lights';

    game.addEntity(entity);

    var ambient = entity.addComponent(LightComponent);
    ambient.light = new THREE.AmbientLight(0xB3B3B3);

    var directional = entity.addComponent(LightComponent);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(0.2, 0.5, 0.4);
    directional.light = directionalLight;
}
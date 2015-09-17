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
var PointerController = require('./components/pointercontroller');
var addColorPicker = require('./addcolorpicker');
var filebutton = require('file-button');

var defaultColor = 'rgb(189, 189, 189)';
window.onload = function() {
    var Game = require('../core/game');

    var game = new Game({
        keyMap: require('./keymap')
    });

    runGame(game);

    addGrid(game);
    addChunk(game);
    addInput(game);
    addLights(game);
    addPointer(game);

    var inputController = game.getEntityByName('input').getComponent(InputController);

    addColorPicker({
        color: defaultColor,
        show: function(color) {
            inputController.hasFocus = false;
        },
        hide: function(color) {
            inputController.hasFocus = true;
        },
        change: function(color) {
            inputController.color = new THREE.Color(color.toRgbString()).getHex()
        }
    });

    $('#save-button').click(function() {
        inputController.save();
    });

    $('#reset-button').click(function() {
        inputController.reset();
    });

    filebutton
        .create({
            multiple: false,
            accept: '.cf'
        })
        .on('fileinput', function(fileinput) {
            inputController.open(fileinput.files[0]);
        })
        .mount(document.getElementById('open-button'));
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

var addPointer = function(game) {
    var entity = new Entity();
    entity.name = 'pointer';

    game.addEntity(entity);

    entity.addComponent(RenderComponent);
    entity.addComponent(PointerController);
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
};
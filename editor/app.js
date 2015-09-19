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

var defaultColor = require('./palette')[0];

window.onload = function() {
    var Game = require('../core/game');

    var game = new Game({
        keyMap: require('./keymap'),
        types: {
            'GridController': require('./components/gridcontroller'),
            'CameraController': require('./components/cameracontroller'),
            'InputController': require('./components/inputcontroller'),
            'ChunkController': require('./components/chunkcontroller'),
            'PointerController': require('./components/pointercontroller')
        }
    });

    runGame(game);

    addGrid(game);
    addChunk(game);
    addInput(game);
    addLights(game);
    addPointer(game);

    var inputController = game.getEntityByName('input').getComponent(InputController);

    require('./form')({
        inputController: inputController
    });
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
    var renderComponent = entity.addComponent(RenderComponent);
    renderComponent.hasEdges = true;
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

    // var ambient = entity.addComponent(LightComponent);
    // ambient.light = new THREE.AmbientLight(0xB3B3B3);

    // var directional = entity.addComponent(LightComponent);
    // var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    // directionalLight.position.set(0.2, 0.5, 0.4);
    // directional.light = directionalLight;
};
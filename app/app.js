var THREE = require('three');

var runGame = require('../core/rungame');
var Entity = require('../core/entity');
var RenderComponent = require('../core/components/rendercomponent');
var CollisionBody = require('../core/components/collisionbody');
var LightComponent = require('../core/components/lightcomponent');
var Grid = require('./components/grid');
var RotateCamera = require('./components/rotatecamera');
var Highlight = require('./components/highlight');
var ChunkController = require('./components/chunkcontroller');

window.onload = function() {

    var Game = require('../core/game');

    var game = new Game({
        keyMap: {
            'up': ['w'],
            'down': ['s']
        }
    });

    addGrid(game);
    addChunk(game);
    addInput(game);
    addLights(game);

    runGame(game);
};

var addGrid = function(game) {
    var entity = new Entity();
    entity.name = 'grid';

    game.addEntity(entity);

    entity.addComponent(RenderComponent);
    entity.addComponent(Grid);
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

    entity.addComponent(RotateCamera);
    entity.addComponent(Highlight);
};

var addLights = function(game) {
    var entity = new Entity();
    entity.name = 'lights';

    game.addEntity(entity);

    var ambient = entity.addComponent(LightComponent);
    ambient.light = new THREE.AmbientLight(0x333333);

    var directional = entity.addComponent(LightComponent);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(0.2, 0.5, 0.4);
    directional.light = directionalLight;

    // var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    // directionalLight.position.set(0, 1, 0);
    // scene.add(directionalLight);
}
var runGame = require('../core/rungame');
var Entity = require('../core/entity');
var RenderComponent = require('../core/components/rendercomponent');
var CollisionBody = require('../core/components/collisionbody');
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
};

var addInput = function(game) {
    var entity = new Entity();
    entity.name = 'input';

    game.addEntity(entity);

    entity.addComponent(RotateCamera);
    entity.addComponent(Highlight);
};
var runGame = require('../core/rungame');
var Entity = require('../core/entity');
var RenderComponent = require('../core/components/rendercomponent');
var CollisionBody = require('../core/components/collisionbody');
var MakeGrid = require('./components/makegrid');
var RotateCamera = require('./components/rotatecamera');

window.onload = function() {

    var Game = require('../core/game');

    var game = new Game({
        keyMap: {
            'up': ['w'],
            'down': ['s']
        }
    });

    var entity = new Entity();

    game.addEntity(entity);

    entity.addComponent(RenderComponent);
    entity.addComponent(MakeGrid);
    entity.addComponent(RotateCamera);
    entity.addComponent(CollisionBody);

    // entity.addComponent(CollisionBody);

    runGame(game);
};
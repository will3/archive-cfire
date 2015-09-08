var runGame = require('../core/rungame');
var Entity = require('../core/entity');
var RenderComponent = require('../core/components/rendercomponent');
var MakeGrid = require('./components/makegrid');

window.onload = function() {

    var Game = require('../core/game');

    var game = new Game({
        keyMap: {
            'up': ['w'],
            'down': ['s']
        }
    });

    var entity = new Entity();
    var renderComponent = new RenderComponent();

    game.addEntity(entity);
    entity.addComponent(renderComponent);

    var makeGrid = new MakeGrid();
    entity.addComponent(makeGrid);

    runGame(game);
};
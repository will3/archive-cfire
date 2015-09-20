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

    var container = $('#container');

    var form = require('./ui/form')({
        inputController: inputController
    });

    inputController.form = form;

    $(function() {
        $(".draggable").draggable();
    });

    window["editor"] = {
        expandGroup: function(name) {
            var div = $("#cf-group-" + name);
            var header = $('.cf-header[name="' + name + '"]');
            if (div.is(':visible')) {
                div.slideUp();
                // Other stuff to do on slideUp
                updateHeader(header, true);
            } else {
                div.slideDown();
                // Other stuff to down on slideDown
                updateHeader(header, false);
            }
        }
    }

    var updateHeader = function(header, collapse) {
        var text = header.attr('value');
        if (text.indexOf('▶') != -1 || text.indexOf('▼') != -1) {
            text = text.substring(2);
        }

        var symbol = collapse ? '▶' : '▼';
        header.attr('value', symbol + ' ' + text);
    }

    // ▼ ▶
    var headers = $('.cf-header');
    headers.each(function() {
        updateHeader($(this), false);
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

    var chunkController = entity.addComponent(ChunkController);
    chunkController.loadFromUrl();
    var renderComponent = entity.addComponent(RenderComponent, 'renderComponent');
    renderComponent.hasEdges = true;
    entity.addComponent(RenderComponent, 'wireFrameRenderComponent');

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
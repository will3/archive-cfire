window.onload = function() {

    var THREE = require('three');

    var Game = require('../core/game');
    var Entity = require('../core/entity');
    var RenderComponent = require('../core/components/rendercomponent');
    var InputComponent = require('../core/components/inputcomponent');
    var runGame = require('../core/rungame');

    var MoveCameraWithMouse = require('./movecamerawithmouse');
    var addEntity = require('../core/macros/addEntity');

    var game = new Game({
        keyMap: {
            'up': ['w'],
            'down': ['s']
        }
    });

    var cube = new Entity();
    addEntity(cube);
    
    cube.transform.position.z = -1000;
    cube.jump = function() {
        this.transform.position.y += 100;
    }
    cube.moveDown = function() {
        this.transform.position.y -= 100;
    }

    //render component
    var renderComponent = new RenderComponent();
    var geometry = new THREE.BoxGeometry(200, 200, 200);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    var mesh = new THREE.Mesh(geometry, material);
    renderComponent.object = mesh;
    cube.addComponent(renderComponent);

    //input component
    var inputComponent = new InputComponent();
    inputComponent.bindEvent('up', 'keydown', cube, 'jump');
    inputComponent.bindEvent('down', 'keydown', cube, 'moveDown');
    cube.addComponent(inputComponent);

    //move camera with mouse
    var cameraComponent = new MoveCameraWithMouse();
    cube.addComponent(cameraComponent);

    runGame(game);
};
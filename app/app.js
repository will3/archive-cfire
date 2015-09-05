window.onload = function() {

    var THREE = require('three');

    var Game = require('../core/game');
    var Entity = require('../core/entity');
    var RenderComponent = require('../core/components/rendercomponent');
    var InputComponent = require('../core/components/inputcomponent');

    var game = new Game({
        keyMap: {
            'up': ['w'],
            'down': ['s']
        }
    });

    var cube = new Entity();
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

    game.addEntity(cube);

    var frameInterval = 1000 / 24.0;

    var interval = function() {
        game.tick(frameInterval);

        setTimeout(interval, frameInterval);
    }

    interval();

};
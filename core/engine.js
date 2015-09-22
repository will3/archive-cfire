var Engine = {
    Game: require('./game'),
    Component: require('./component'),
    Block: {
        serialize: require('./block/serialize'),
        deserialize: require('./block/deserialize'),
        mesh: require('./block/mesh'),
        Chunk: require('./block/chunk')
    },
    Components: {
        CollisionBody: require('./components/collisionbody'),
        LightComponent: require('./components/lightcomponent'),
        RenderComponent: require('./components/rendercomponent'),
        TransformComponent: require('./components/transformcomponent'),
        CameraController: require('./components/cameracontroller')
    }
};

module.exports = Engine;

// var _ = require('lodash');
// var extend = require('extend');

// var Game = require('./game');
// var Component = require('./component');

// engine.start = function() {
//     var game = new Game();
//     game.start();
// };

// var components = {};
// engine.registerComponent = function(name, func) {
//     if (_.isFunction(func)) {
//         this.components[name] = extend(new Component(), func());
//         return;
//     }

//     this.components[name] = extend(new Component(), func);
// };

// module.exports = engine;
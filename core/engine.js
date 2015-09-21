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
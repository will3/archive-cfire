module.exports = {
    entities: [{
        name: 'grid',
        components: [
            'RenderComponent',
            'GridController',
            'CollisionBody'
        ]
    }, {
        name: 'chunk',
        components: [
            'ChunkController', {
                type: 'RenderComponent',
                name: 'renderComponent',
                hasEdges: true
            }, {
                type: 'RenderComponent',
                name: 'wireFrameRenderComponent'
            },
            'CollisionBody'
        ]
    }, {
        name: 'input',
        components: [
            'CameraController',
            'InputController',
            'FormController'
        ]
    }, {
        name: 'lights',
        components: [{
                type: 'LightComponent',
                lightType: 'ambient',
                color: '0x000000'
            },

            {
                type: 'LightComponent',
                lightType: 'directional',
                color: 0xffffff,
                intensity: 1.0,
                position: {
                    x: 0.2,
                    y: 0.5,
                    z: 0.4
                }
            }
        ]
    }, {
        name: 'pointer',
        components: [
            'RenderComponent',
            'PointerController'
        ]
    }]
};
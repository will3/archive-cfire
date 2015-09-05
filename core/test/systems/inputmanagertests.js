var sinon = require('sinon');
var expect = require('chai').expect;

var InputManager = require('../../systems/inputmanager');

describe('InputManager', function() {
    var inputManager;

    beforeEach(function() {
        inputManager = new InputManager({
            bindKeyboardFunc: function() {}
        });
    });

    it('should record key down', function() {
        inputManager.handleKeydown({
            keyCode: 65
        });

        expect(inputManager.keydowns).to.eql(['a']);
    });

    it('should record key up', function() {
        inputManager.handleKeyup({
            keyCode: 65
        });

        expect(inputManager.keyups).to.eql(['a']);
    });

    it('should record key hold', function() {
        inputManager.handleKeydown({
            keyCode: 65
        });

        expect(inputManager.keyholds).to.eql(['a']);
    });

    it('should record key down once before key up', function() {
        inputManager.keyholds = ['a'];
        inputManager.handleKeydown({
            keyCode: 65
        });

        expect(inputManager.keydowns).to.be.empty;
    });

    describe('#processBinding', function() {
        it('should process keyup', function() {
            var target = sinon.mock({
                func: function() {}
            });

            var binding = {
                type: 'keyup',
                event: 'up',
                target: target.object,
                func: 'func'
            }

            inputManager.keyups = ['w'];
            inputManager.keyMap = {
                'up': ['w']
            };

            target.expects('func');

            inputManager.processBinding(binding);

            target.verify();
        });

        it('should process keydown', function() {
            var target = sinon.mock({
                func: function() {}
            });

            var binding = {
                type: 'keydown',
                event: 'up',
                target: target.object,
                func: 'func'
            }

            inputManager.keydowns = ['w'];
            inputManager.keyMap = {
                'up': ['w']
            };

            target.expects('func');

            inputManager.processBinding(binding);

            target.verify();
        });

        it('should process keyhold', function() {
            var target = sinon.mock({
                func: function() {}
            });

            var binding = {
                type: 'keyhold',
                event: 'up',
                target: target.object,
                func: 'func'
            }

            inputManager.keyholds = ['w'];
            inputManager.keyMap = {
                'up': ['w']
            };

            target.expects('func').withArgs(1.0);

            inputManager.processBinding(binding);

            target.verify();
        });
    });
});
var sinon = require('sinon');
var expect = require('chai').expect;

var InputManager = require('../../systems/inputmanager');
var InputState = require('../../inputstate');

describe('InputManager', function() {
    var inputManager, inputState;

    beforeEach(function() {
        inputState = new InputState();

        inputManager = new InputManager({
            bindKeyboardFunc: function() {},
            bindMouseFunc: function() {},
            inputState: inputState
        });
    });

    it('should record key down', function() {
        inputManager.handleKeydown({
            keyCode: 65
        });

        expect(inputState.keydowns).to.eql(['a']);
    });

    it('should record key up', function() {
        inputManager.handleKeyup({
            keyCode: 65
        });

        expect(inputState.keyups).to.eql(['a']);
    });

    it('should record key hold', function() {
        inputManager.handleKeydown({
            keyCode: 65
        });

        expect(inputState.keyholds).to.eql(['a']);
    });

    it('should record key down once before key up', function() {
        inputState.keyholds = ['a'];
        inputManager.handleKeydown({
            keyCode: 65
        });

        expect(inputState.keydowns).to.be.empty;
    });

    it('should record mouse down', function() {
        inputManager.handleMousedown();
        expect(inputState.mousedown).to.be.true;
    });

    it('should record mouse up', function() {
        inputState.mousedown = true;
        inputManager.handleMouseup();
        expect(inputState.mousedown).to.be.false;
    });

    it('should record mouse leave', function() {
        inputState.mousedown = true;
        inputManager.handleMouseleave();
        expect(inputState.mousedown).to.be.false;
    });

    it('should record mouse move', function() {
        inputManager.handleMousemove({
            clientX: 50,
            clientY: 50
        });

        inputManager.handleMousemove({
            clientX: 100,
            clientY: 100
        });

        expect(inputState.mouseMoveX).to.equal(50);
        expect(inputState.mouseMoveY).to.equal(50);
    });

    it('should record mouse drag when mouse is down', function() {
        inputState.mousedown = true;

        inputManager.handleMousemove({
            clientX: 50,
            clientY: 50
        });

        inputManager.handleMousemove({
            clientX: 100,
            clientY: 100
        });

        expect(inputState.mouseDragX).to.equal(50);
        expect(inputState.mouseDragY).to.equal(50);
    });

    it('should not record mouse drag when mouse is up', function() {
        inputManager.mousedown = false;

        inputManager.handleMousemove({
            clientX: 50,
            clientY: 50
        });

        inputManager.handleMousemove({
            clientX: 100,
            clientY: 100
        });

        expect(inputState.mouseDragX).to.equal(0);
        expect(inputState.mouseDragY).to.equal(0);
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

            inputState.keyups = ['w'];
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

            inputState.keydowns = ['w'];
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

            inputState.keyholds = ['w'];
            inputManager.keyMap = {
                'up': ['w']
            };

            target.expects('func').withArgs(1.0);

            inputManager.processBinding(binding);

            target.verify();
        });
    });
});
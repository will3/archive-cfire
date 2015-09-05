var sinon = require('sinon');
var expect = require('chai').expect;

var Game = require('../game');

describe('Game', function() {
    var game, renderer, inputManager, container, window;

    beforeEach(function() {
        renderer = {};
        inputManager = {};
        container = {
            focus: function() {}
        };
        window = {};

        game = new Game({
            renderer: renderer,
            inputManager: inputManager,
            container: container,
            window: window
        });
    });

    describe('#tick', function() {
        it('should tick all systems', function() {
            var sys1 = sinon.mock({
                tick: function() {}
            });
            var sys2 = sinon.mock({
                tick: function() {}
            });

            game.systems = [sys1.object, sys2.object];

            sys1.expects('tick').withArgs(game.world);
            sys2.expects('tick').withArgs(game.world);

            game.tick();

            sys1.verify();
            sys2.verify();
        });
    });
});
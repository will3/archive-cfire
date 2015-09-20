var sinon = require('sinon');
var expect = require('chai').expect;

var Game = require('../game');

describe('Game', function() {
    var game, renderer, inputManager, container, window;

    beforeEach(function() {
        container = {
            focus: function() {}
        };

        systems = [];

        game = new Game({
            systems: systems,
            container: container
        });
    });

    describe('#tick', function() {
        it('should tick all systems', function() {
            var sys1 = sinon.mock({
                start: function() {},
                tick: function() {}
            });
            var sys2 = sinon.mock({
                start: function() {},
                tick: function() {}
            });

            game.systems = [sys1.object, sys2.object];

            sys1.expects('tick');
            sys2.expects('tick');

            game.tick();

            sys1.verify();
            sys2.verify();
        });
    });
});
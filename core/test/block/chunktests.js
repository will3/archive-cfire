var expect = require('chai').expect;
var sinon = require('sinon');

var Chunk = require('../../block/chunk');

describe('Chunk', function() {
    it('should add obj', function() {
        var chunk = new Chunk();
        chunk.add(1, 2, 3, 'test');

        expect(chunk.map).to.eql({
            '1': {
                '2': {
                    '3': 'test'
                }
            }
        });
    });

    it('should remove obj', function() {
        var chunk = new Chunk();
        chunk.add(1, 2, 3, 'test');
        chunk.remove(1, 2, 3);
        expect(chunk.map[1][2][3]).to.be.empty;
    });

    it('should get obj', function() {
        var chunk = new Chunk();
        chunk.add(1, 2, 3, 'test');
        expect(chunk.get(1, 2, 3)).to.equal('test');
    });

    it('should visit objs', function() {
        var chunk = new Chunk();
        chunk.add(1, 2, 3, 'a');
        chunk.add(2, 3, 4, 'b');
        chunk.add(3, 4, 5, 'c');

        var spy = sinon.spy();
        chunk.visit(spy);

        spy.calledWith(1, 2, 3, 'a');
        spy.calledWith(2, 3, 4, 'b');
        spy.calledWith(3, 4, 5, 'c');
    });
});
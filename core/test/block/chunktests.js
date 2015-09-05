var expect = require('chai').expect;

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
        expect(chunk.get(1,2,3)).to.equal('test');
    });
});
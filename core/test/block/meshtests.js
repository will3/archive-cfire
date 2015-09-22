var mesh = require('../../block/mesh');
var expect = require('chai').expect;
var Chunk = require('../../block/chunk');

describe('mesh', function() {
    it('should have 6 faces and 8 vertices for a block', function() {
        var chunk = new Chunk();
        chunk.add(0, 0, 0, 'a block');

        var object = mesh(chunk, {
            ouputGeometry: false
        });

        expect(object.geometry.faces.length).to.equal(6 * 2);
        expect(object.geometry.vertices.length).to.equal(8);
    });

    it('should have 10 faces and 12 vertices for 2 neibouring blocks', function() {
        var chunk = new Chunk();
        chunk.add(0, 0, 0, 'a block');
        chunk.add(1, 0, 0, 'neighbour');

        var object = mesh(chunk, {
            bufferGeometry: false
        });

        expect(object.geometry.faces.length).to.equal(10 * 2);
        expect(object.geometry.vertices.length).to.equal(12);
    });
});
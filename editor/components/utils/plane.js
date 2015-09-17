var THREE = require('three');

module.exports = function(size, y){
    //  d  c
    //a  b
    var a = new THREE.Vector3(-size / 2.0, y, -size / 2.0);
    var b = new THREE.Vector3(size / 2.0, y, -size / 2.0);
    var c = new THREE.Vector3(size / 2.0, y, size / 2.0);
    var d = new THREE.Vector3(-size / 2.0, y, size / 2.0);

    var geometry = new THREE.Geometry();
    geometry.vertices.push(a, b, c, d);
    geometry.faces.push(new THREE.Face3(0, 2, 1), new THREE.Face3(0, 3, 2));
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });

    return new THREE.Mesh(geometry, material);
};
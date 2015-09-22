var THREE = require('three');

var Engine = require('../../core/engine');
var Component = Engine.Component;

var SmokeTrail = function() {
    Component.call(this);

    this.emitInterval = 100;
};

SmokeTrail.prototype = Object.create(Component.prototype);
SmokeTrail.prototype.constructor = SmokeTrail;

SmokeTrail.prototype.start = function() {
    setInterval(this.emit.bind(this), this.emitInterval);
};

SmokeTrail.prototype.emit = function() {
    // var smoke = this.addEntityFromPrefab("smoke");
    // var renderComponent = smoke.getComponent('RenderComponent');
    // var map = THREE.ImageUtils.loadTexture("images/default.png");
    // var material = new THREE.SpriteMaterial({
    //     map: map,
    //     color: 0xffffff
    // });

    // var sprite = new THREE.Sprite(material);
    // sprite.position = new THREE.Vector3();
    // sprite.scale = new THREE.Vector3(2, 2, 2);
    // renderComponent.object = sprite;
};

module.exports = SmokeTrail;
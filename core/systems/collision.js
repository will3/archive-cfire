var _ = require('lodash');

var System = require('../system');
var CollisionBody = require('../components/collisionbody');
var getCameraRaycaster = require('../utils/getmouseraycaster');

var Collision = function() {
    System.call(this);

    this.componentPredicate = function(component) {
        return component instanceof CollisionBody;
    }

    this.mouseCollision = null;
};

Collision.prototype = Object.create(System.prototype);
Collision.prototype.constructor = Collision;

Collision.prototype.tick = function() {
    var raycaster = getCameraRaycaster();

    var bodies = [];
    //process mouse over
    for (var id in this.componentMap) {
        var body = this.componentMap[id];

        if (body.object == null) {
            continue;
        }

        bodies.push(body);
    }

    this.mouseCollision = _(bodies).map(function(body) {
        return {
            body: body,
            intersect: raycaster.intersectObject(body.object)[0]
        }
    }).filter(function(result) {
        return result.intersect != null;
    }).sortBy(function(result) {
        return result.intersect.distance;
    }).value()[0];

};

module.exports = Collision;
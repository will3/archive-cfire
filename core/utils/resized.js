var $ = require('jquery');

module.exports = function(callback) {
    var rtime;
    var timeout = false;
    var delta = 100;
    $(window).resize(function() {
        rtime = new Date();
        if (timeout === false) {
            timeout = true;
            setTimeout(resizeend, delta);
        }
    });

    function resizeend() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            callback();
        }
    }
};
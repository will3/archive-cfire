var _ = require('lodash');
var $ = require('jquery');

var System = require('../system');

var Console = function() {
    System.call(this);

    this.leftPadding = 20;
    this.topPadding = 20;
    this.lineSpacing = 18;
    this.maxLines = 5;
    this.history = [];
    this.divs = [];
};

Console.prototype = Object.create(System.prototype);
Console.prototype.constructor = Console;

Console.prototype.log = function(text) {
    var div = this.createTextDiv(text);
    this.divs.push(div);
    this.history.push(text);
    this.updateLayout();
};

Console.prototype.createTextDiv = function(text) {
    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = this.leftPadding + 'px';
    div.style.fontFamily = "'Roboto', 'sans-serif'";
    div.style.fontSize = 'small';
    div.style.color = '#666666';

    div.innerHTML = text;

    return div;
};

Console.prototype.updateLayout = function() {
    this.divs.forEach(function(div) {
        if (document.body.contains(div)) {
            document.body.removeChild(div);
        }
    });

    var index = 0;
    var self = this;
    _.takeRight(this.divs, this.maxLines).forEach(function(div) {
        document.body.appendChild(div);
        div.style.top = self.topPadding + self.lineSpacing * index + 'px';
        index++;
    });
};

module.exports = Console;
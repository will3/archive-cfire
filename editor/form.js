var $ = require('jquery');
var assert = require('assert-plus');
var filebutton = require('file-button');

var addColorPicker = require('./addcolorpicker');
var palette = require('./palette');

module.exports = function(params) {
    params = params || {};
    var inputController = params.inputController;

    var blockX = $('#block-x');
    var blockY = $('#block-y');
    var blockZ = $('#block-z');
    var scaleResetButton = $('#scale-reset-button');
    var newButton = $('#new-button');
    var openButton = $('#open-button');
    var saveButton = $('#save-button');

    assert.object(blockX[0]);
    assert.object(blockY[0]);
    assert.object(blockZ[0]);
    assert.object(scaleResetButton[0]);
    assert.object(newButton[0]);
    assert.object(openButton[0]);
    assert.object(saveButton[0]);

    blockX.bind('input', function() {
        inputController.setBlockX(parseFloat(blockX.val()));
    });

    blockY.bind('input', function() {
        inputController.setBlockY(parseFloat(blockY.val()));
    });

    blockZ.bind('input', function() {
        inputController.setBlockZ(parseFloat(blockZ.val()));
    });

    scaleResetButton.click(function() {
        blockX.val(1);
        blockY.val(1);
        blockZ.val(1);
        inputController.setBlockX(1);
        inputController.setBlockY(1);
        inputController.setBlockZ(1);
    });

    saveButton.click(function() {
        inputController.save();
    });

    newButton.click(function() {
        inputController.reset();
    });

    filebutton
        .create({
            multiple: false,
            accept: '.cf'
        })
        .on('fileinput', function(fileinput) {
            inputController.openFile(fileinput.files[0]);
        })
        .mount(openButton.get()[0]);

    addColorPicker({
        color: palette[0],
        show: function(color) {
            inputController.hasFocus = false;
        },
        hide: function(color) {
            inputController.hasFocus = true;
        },
        change: function(color) {
            inputController.color = new THREE.Color(color.toRgbString()).getHex()
        },
        palette: palette
    });
};
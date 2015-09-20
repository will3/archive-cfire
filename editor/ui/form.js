var $ = require('jquery');
var assert = require('assert-plus');
var filebutton = require('file-button');
var THREE = require('three');

var addColorPicker = require('./addcolorpicker');
var palette = require('../palette');

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
    var undoButton = $('#undo-button');
    var redoButton = $('#redo-button');
    var gridCheckbox = $('#grid-checkbox');
    var ssaoCheckbox = $('#ssao-checkbox');
    var onlyaoCheckbox = $('#onlyao-checkbox');
    var edgesCheckbox = $('#edges-checkbox');
    var zoomInButton = $('#zoom-in-button');
    var zoomOutButton = $('#zoom-out-button');

    assert.object(blockX[0]);
    assert.object(blockY[0]);
    assert.object(blockZ[0]);
    assert.object(scaleResetButton[0]);
    assert.object(newButton[0]);
    assert.object(openButton[0]);
    assert.object(saveButton[0]);
    assert.object(undoButton[0]);
    assert.object(redoButton[0]);
    assert.object(gridCheckbox[0]);
    assert.object(ssaoCheckbox[0]);
    assert.object(onlyaoCheckbox[0]);
    assert.object(edgesCheckbox[0]);

    var form = {
        blockX: blockX,
        blockY: blockY,
        blockZ: blockZ,
        scaleResetButton: scaleResetButton,
        newButton: newButton,
        openButton: openButton,
        saveButton: saveButton,
        undoButton: undoButton,
        redoButton: redoButton,
        gridCheckbox: gridCheckbox,
        ssaoCheckbox: ssaoCheckbox,
        onlyaoCheckbox: onlyaoCheckbox,
        edgesCheckbox: edgesCheckbox,
        zoomInButton: zoomInButton,
        zoomOutButton: zoomOutButton
    }

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

    undoButton.click(function() {
        inputController.undo();
    });

    redoButton.click(function() {
        inputController.redo();
    });

    gridCheckbox.change(function() {
        var checked = $(this).is(":checked");
        inputController.setGridHidden(!checked);
    });

    ssaoCheckbox.change(function() {
        var checked = $(this).is(":checked");
        inputController.setSsao(checked);
    });

    onlyaoCheckbox.change(function() {
        var checked = $(this).is(":checked");
        inputController.setOnlyao(checked);
    });

    edgesCheckbox.change(function() {
        var checked = $(this).is(":checked");
        inputController.setEdges(checked);
    });

    zoomInButton.click(function() {
        inputController.zoomIn();
    });

    zoomOutButton.click(function() {
        inputController.zoomOut();
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

    return form;
};
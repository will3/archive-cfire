var $ = require('jquery');
var assert = require('assert-plus');

module.exports = function() {
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
    var wireframeCheckbox = $('#wireframe-checkbox');
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
        wireframeCheckbox: wireframeCheckbox,
        zoomInButton: zoomInButton,
        zoomOutButton: zoomOutButton
    }

    return form;
};
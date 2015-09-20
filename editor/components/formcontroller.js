var assert = require('assert-plus');
var filebutton = require('file-button');
var THREE = require('three');

var Component = require('../../core/component');
var addColorPicker = require('./ui/addcolorpicker');
var palette = require('../palette');

var FormController = function() {
    Component.call(this);

    this.form = require('./ui/form')();
};

FormController.prototype = Object.create(Component.prototype);
FormController.prototype.constructor = FormController;

FormController.prototype.start = function() {
    var inputController = this.getComponent('InputController');
    assert.object(inputController, 'inputController');

    var defaultColor = require('../palette')[0];

    //set input controller color
    inputController.color = new THREE.Color(defaultColor).getHex();

    var container = $('#container');

    $(function() {
        $(".draggable").draggable();
    });

    window["editor"] = {
        expandGroup: function(name) {
            var div = $("#cf-group-" + name);
            var header = $('.cf-header[name="' + name + '"]');
            if (div.is(':visible')) {
                div.slideUp();
                // Other stuff to do on slideUp
                updateHeader(header, true);
            } else {
                div.slideDown();
                // Other stuff to down on slideDown
                updateHeader(header, false);
            }
        }
    }

    var updateHeader = function(header, collapse) {
        var text = header.attr('value');
        if (text.indexOf('▶') != -1 || text.indexOf('▼') != -1) {
            text = text.substring(2);
        }

        var symbol = collapse ? '▶' : '▼';
        header.attr('value', symbol + ' ' + text);
    }

    // ▼ ▶
    var headers = $('.cf-header');
    headers.each(function() {
        updateHeader($(this), false);
    });

    var form = this.form;
    var blockX = form.blockX;
    blockX.bind('input', function() {
        inputController.setBlockX(parseFloat(blockX.val()));
    });

    var blockY = form.blockY;
    blockY.bind('input', function() {
        inputController.setBlockY(parseFloat(blockY.val()));
    });

    var blockZ = form.blockZ;
    blockZ.bind('input', function() {
        inputController.setBlockZ(parseFloat(blockZ.val()));
    });

    $('input[type="number"]').keyup(function(e) {
        if (e.keyCode == 13) {
            // Do something
            $('#container').focus();
        }
    });

    var scaleResetButton = form.scaleResetButton;
    scaleResetButton.click(function() {
        blockX.val(1);
        blockY.val(1);
        blockZ.val(1);
        inputController.setBlockX(1);
        inputController.setBlockY(1);
        inputController.setBlockZ(1);
    });

    form.saveButton.click(function() {
        inputController.save();
    });

    form.newButton.click(function() {
        inputController.reset();
    });

    form.undoButton.click(function() {
        inputController.undo();
    });

    form.redoButton.click(function() {
        inputController.redo();
    });

    form.gridCheckbox.change(function() {
        var checked = $(this).is(":checked");
        inputController.setGridHidden(!checked);
    });

    form.wireframeCheckbox.change(function() {
        var checked = $(this).is(":checked");
        inputController.setWireFrameHidden(!checked);
    });

    form.ssaoCheckbox.change(function() {
        var checked = $(this).is(":checked");
        inputController.setSsao(checked);
    });

    form.onlyaoCheckbox.change(function() {
        var checked = $(this).is(":checked");
        inputController.setOnlyao(checked);
    });

    form.edgesCheckbox.change(function() {
        var checked = $(this).is(":checked");
        inputController.setEdges(checked);
    });

    form.zoomInButton.click(function() {
        inputController.zoomIn();
    });

    form.zoomOutButton.click(function() {
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
        .mount(form.openButton.get()[0]);

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

module.exports = FormController;
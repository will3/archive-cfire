var extend = require('extend');
var $ = require('jquery');
require('spectrum-colorpicker')($);

module.exports = function(params) {
    params = params || {};

    var colorPickerDiv = $("<div id='color-picker-container'>");
    colorPickerDiv.css('position', 'absolute');
    colorPickerDiv.css('left', 20 + 'px');
    colorPickerDiv.css('top', 20 + 'px');

    var colorPicker = $("<input type='text' id='color-picker'/>");
    colorPickerDiv.append(colorPicker);
    $('#container').append(colorPickerDiv);

    colorPicker.spectrum(extend({
        showPalette: true,
        showSelectionPalette: true,
        palette: [],
        localStorageKey: "spectrum.homepage",
        palette: [
            [
                'rgb(183, 28, 28)',
                'rgb(233, 30, 99)',
                'rgb(156, 39, 176)',
                'rgb(103, 58, 183)',
                'rgb(63, 81, 181)',
                'rgb(33, 150, 243)',
                'rgb(0, 188, 212)',
                'rgb(76, 175, 80)',
                'rgb(255, 235, 59)',
                'rgb(255, 152, 0)',
                'rgb(189, 189, 189)',
                'rgb(96, 125, 139)'
            ],
        ]
    }, params));
};
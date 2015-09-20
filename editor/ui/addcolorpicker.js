var extend = require('extend');
var $ = require('jquery');
require('spectrum-colorpicker')($);

module.exports = function(params) {
    params = params || {};
    var palette = params || [];

    var colorPicker = $('#color-picker');
    colorPicker.spectrum(extend({
        showPalette: true,
        showSelectionPalette: true,
        palette: [],
        localStorageKey: "spectrum.homepage",
        palette: [
            palette
        ]
    }, params));
};
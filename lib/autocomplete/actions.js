var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createAutocompleteActions = function () {

    Homey.manager('flow').on('action.set_countdown_timer.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getvariables().filter(util.filterVariable(value, 'number')));
    });

    Homey.manager('flow').on('action.stop_countdown_timer.variable.autocomplete', function (callback, value) {
        callback(null, variableManager.getvariables().filter(util.filterVariable(value, 'number')));
    });
}

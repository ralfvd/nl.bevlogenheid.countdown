var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');

exports.createAutocompleteTriggers = function (variables) {
    //Triggers autocompletes
    Homey.manager('flow').on('trigger.countdown_to_zero.variable.autocomplete', function(callback, value) {
    callback(null, variableManager.getvariables().filter(util.filterVariable(value, 'number')));
    });
    Homey.manager('flow').on('trigger.countdown_started.variable.autocomplete', function(callback, value) {
    callback(null, variableManager.getvariables().filter(util.filterVariable(value, 'number')));
    });
    Homey.manager('flow').on('trigger.countdown_stopped.variable.autocomplete', function(callback, value) {
    callback(null, variableManager.getvariables().filter(util.filterVariable(value, 'number')));
    });
}

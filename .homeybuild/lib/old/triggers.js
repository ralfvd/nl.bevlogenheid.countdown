var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');

exports.createAutocompleteTriggers = function (variables) {
    //Triggers autocompletes
    homey.flow.getTriggerCard('countdown_to_zero.variable.autocomplete', function(callback, value) {
    return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });
    homey.flow.getTriggerCard('countdown_started.variable.autocomplete', function(callback, value) {
    return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });
    homey.flow.getTriggerCard('countdown_stopped.variable.autocomplete', function(callback, value) {
    return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });
    homey.flow.getTriggerCard('countdown_timer_changed.variable.autocomplete', function(callback, value) {
    return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });

}

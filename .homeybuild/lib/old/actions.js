var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createAutocompleteActions = function () {

    homey.flow.getActionCard('set_countdown_timer').getArgument('variable').registerAutocompleteListener(async (value)=> {
        return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });

    homey.flow.getActionCard('set_random_countdown_timer').getArgument('variable').registerAutocompleteListener(async (value)=> {
        return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });

    homey.flow.getActionCard('stop_countdown_timer').getArgument('variable').registerAutocompleteListener(async (value)=> {
        return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });

    homey.flow.getActionCard('adjust_countdown_timer').getArgument('variable').registerAutocompleteListener(async (value)=> {
        return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });
}

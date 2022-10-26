var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');
exports.createAutocompleteConditions = function () {

    homey.flow.getConditionCard('timer_running').getArgument('variable').registerAutocompleteListener(async (value)=> {
        return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });

    homey.flow.getConditionCard('timer_matches_number').getArgument('variable').registerAutocompleteListener(async (value)=> {
        return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });

    homey.flow.getConditionCard('timer_less_than_number').getArgument('variable').registerAutocompleteListener(async (value)=> {
        return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });

    homey.flow.getConditionCard('timer_greater_than_number').getArgument('variable').registerAutocompleteListener(async (value)=> {
        return variableManager.getVariables().filter(util.filterVariable(value, 'number'));
    });
}

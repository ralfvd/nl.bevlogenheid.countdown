var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');

exports.createConditions = function (homey) {

    homey.flow.getConditionCard('timer_running').registerRunListener(async (args) => {
        if (args.variable) {
            var variable = variableManager.getvariable(args.variable.name);
            if (variable && variable.value < 0) {
                homey.log('condition trigger: timer_running');
                return true;
            }
        }
        return false;
    });

    homey.flow.getConditionCard('timer_matches_number').registerRunListener(async (args) => {
        if (args.variable) {
            var variable = variableManager.getvariable(args.variable.name);
            if (variable && variable.value === args.value) {
                homey.log('condition trigger: timer_matches_number');
                return true;
            }
        }
        return false;
    });

    homey.flow.getConditionCard('timer_less_than_number').registerRunListener(async (args) => {
        if (args.variable) {
            var variable = variableManager.getvariable(args.variable.name);
            if (variable && Number(variable.value) < Number(args.value)) {
                homey.log('condition trigger: timer_less_than_number');
                return true;
            }
        }
        return false;
    });

    homey.flow.getConditionCard('timer_greater_than_number').registerRunListener(async (args) => {
        if (args.variable) {
            var variable = variableManager.getvariable(args.variable.name);
            if (variable && Number(variable.value) > Number(args.value)) {
                homey.log('condition trigger: timer_less_than_number');
                return true;
            }
        }
        return false;
    });
};

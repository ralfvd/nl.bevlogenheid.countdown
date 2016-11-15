var util = require('../util/util.js');
var variableManager = require('../variablemanagement/variablemanagement.js');

exports.createConditions = function (variables) {

    Homey.manager('flow').on('condition.timer_running', function (callback, args) {
        if (args.variable) {
            var variable = variableManager.getvariable(args.variable.name);
            if (variable && variable.value < 0 ) {
                Homey.log('timer_running');
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });

    Homey.manager('flow').on('condition.timer_matches_number', function (callback, args) {
        if (args.variable) {
            var variable = variableManager.getvariable(args.variable.name);
            if (variable && variable.value === args.value) {
                Homey.log('timer_matches_number');
                callback(null, true);
                return;
            }
        }
        callback(null, false);
    });

    
}

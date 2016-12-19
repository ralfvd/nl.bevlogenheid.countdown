var util = require('../util/util.js');

var newVar = '';
var insights = [];

module.exports = {
    init: function() {
        //Homey.manager('insights').getLogs(function(err, logs) {
        //    logs.forEach(function (log) {
        //        //Homey.manager('insights').deleteLog(log.name, function (err, state) { });
        //        insights.push(log.name);
        //    });
        //});

        Homey.manager('settings').on('set', function(action) {
            if (action == 'changedvariables') {
                changeObject = Homey.manager("settings").get('changedvariables');
                var newvariables = changeObject.variables;
                var newvariable = changeObject.variable;
                //Homey.log('-----Vars Changed----');
                //Homey.log(newvariables);
                //Homey.log('---------------------');
                if (!newvariables) {
                    newvariables = [];
                }

                //Homey.log('-----Var Changed-----');
                //Homey.log(newvariable);
                //Homey.log('---------------------');

                var oldvariables = getvariables();
                var oldvariable = findvariable(oldvariables, newvariable.name);
                processValueChanged(newvariables, oldvariable, newvariable);
            }
        });
    },
    getvariables: function() {
        return getvariables();
    },
    getvariable : function(variable) {
        return findvariable(getvariables(), variable);
    },
    updatevariable: function (variable, value, type, setdate) {
        var variables = getvariables();
        var oldvariable = findvariable(variables, variable);
	if (setdate == '') {
	    var setdate = oldvariable.lastChanged;
        }
        if (oldvariable) {
            if (oldvariable.value === value) {
                return;
            }
            variables.splice(variables.indexOf(oldvariable), 1);
        } else {
            return;
        }

        var newvariable = {
            name: variable,
            value: value,
            type: type,
            hasInsights: oldvariable.hasInsights,
            remove: oldvariable.remove,
            lastChanged: setdate
        }
        variables.unshift(newvariable);

        processValueChanged(variables, oldvariable, newvariable);
        Homey.manager('api').realtime('setting_changed', newvariable);
    }

}

function findvariable(variables, variable) {
    return variables.filter(function (item) {return item.name === variable;
    })[0];
}
function processValueChanged(variables, oldvariable, newvariable) {
    Homey.manager('settings').set('variables', variables);
}

function logExists(variableName) {
    return insights.indexOf(variableName) > -1;
}


function getShortDate() {
    return new Date().toISOString();
}

function getvariables() {
    var varCollection = Homey.manager("settings").get('variables');
    //Homey.log('----Get variables----');
    //Homey.log(varCollection);
    //Homey.log('---------------------');
    if (varCollection === undefined) {
        return [];
    }
    return varCollection;
}

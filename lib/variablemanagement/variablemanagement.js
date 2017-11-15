var util = require('../util/util.js');

var newVar = '';
var insights = [];
var tokens = [];

module.exports = {
    init: function() {
        //Homey.manager('insights').getLogs(function(err, logs) {
        //    logs.forEach(function (log) {
        //        //Homey.manager('insights').deleteLog(log.name, function (err, state) { });
        //        insights.push(log.name);
        //    });
        //});
        var variables = getvariables();
        variables.forEach(function(variable) {
            Homey.manager('flow').registerToken(variable.name, {
                type: 'number',
                title: variable.name
            }, function (err, token) {
                if (err) return console.error('registerToken error:', err);
                if (variable.value == 0 || variable.value == -1) {
                  token.setValue(0, function (err) {
                      if (err) return console.error('setValue error:', err);
                  });
                } else {
                  token.setValue(variable.value, function (err) {
                    if (err) return console.error('setValue error:', err);
                  });
                }
                tokens.push(token);
            });
        });
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

function processValueChanged(variables, oldVariable, newVariable) {
    Homey.manager('settings').set('variables', variables);
    Homey.log(newVariable.value);
    if (newVariable && !oldVariable) {
        Homey.log('start register token')
        Homey.manager('flow').registerToken(newVariable.name, {
            type: newVariable.type,
            title: newVariable.name
        }, function (err, token) {
            if (err) return console.error('registerToken error:', err);
            if (newVariable.value == 0 || newVariable.value == -1) {
              token.setValue(0, function (err) {
                  if (err) return console.error('setValue error:', err);
              });
            } else {
              token.setValue(newVariable.value, function (err) {
                if (err) return console.error('setValue error:', err);
              });
            }
            tokens.push(token);
        });
        return;
    }

    if (newVariable) {
        var token = tokens.find(function (dev) {
            return dev.id == newVariable.name;
        });
        if (token) {
            token.setValue(newVariable.value,
                function (err) {
                if (err) return console.error('setValue error:', err);
            });
        }
    }

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
